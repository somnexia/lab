const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const logService = require('./logService');
const {
  DEFAULT_REGISTER_ROLE,
  ROLE_LABELS,
  ROLE_VALUES,
  ROLES,
  isSystemAdmin,
} = require('../config/roles');
const {
  skipLabScope,
  resolveActorLabId,
  assertLabAccess,
} = require('../utils/labScope');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
/** Фаза 3: было 1h; чуть длиннее для удобства REST/UI. Refresh-токен — позже. */
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';

/** User → Employee → Laboratory (tenant через employees.lab_id) */
const USER_LAB_INCLUDE = {
  association: 'employee',
  include: [{ association: 'laboratory', required: false }],
};

function toPublicUser(user) {
  const plain = user.get ? user.get({ plain: true }) : { ...user };
  delete plain.password;
  return plain;
}

/**
 * Tenant для JWT/профиля (фаза 3).
 * system_admin → null (= все лаборатории).
 * Остальные → employees.lab_id или null, если employee не привязан.
 */
function resolveLaboratoryId(user) {
  if (user.role === ROLES.SYSTEM_ADMIN) {
    return null;
  }
  const labId = user.employee?.lab_id;
  return labId == null ? null : Number(labId);
}

function resolveEmployeeId(user) {
  if (user.employee_id != null) return Number(user.employee_id);
  if (user.employee?.id != null) return Number(user.employee.id);
  return null;
}

/**
 * Payload JWT (фаза 3).
 * Было: { id, email }
 * Стало: { id, email, role, laboratory_id, employee_id }
 */
function buildTokenPayload(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role || DEFAULT_REGISTER_ROLE,
    laboratory_id: resolveLaboratoryId(user),
    employee_id: resolveEmployeeId(user),
  };
}

/**
 * Ответ login/profile для клиента (navPerms на фазе 7).
 * Добавляет laboratory_id, roleLabel; пароль никогда не отдаём.
 */
function toAuthUser(user) {
  const plain = toPublicUser(user);
  const role = plain.role || DEFAULT_REGISTER_ROLE;
  return {
    ...plain,
    role,
    roleLabel: ROLE_LABELS[role] || role,
    laboratory_id: resolveLaboratoryId(user),
    employee_id: resolveEmployeeId(user),
  };
}

function signAccessToken(user) {
  return jwt.sign(buildTokenPayload(user), JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Фаза 6a: lab_admin не может назначить system_admin;
 * роль должна быть из ROLE_VALUES.
 */
function resolveAssignableRole(actor, requestedRole) {
  if (requestedRole == null || requestedRole === '') {
    return null;
  }
  const role = String(requestedRole).trim();
  if (!ROLE_VALUES.includes(role)) {
    const err = new Error(`Недопустимая роль: ${role}`);
    err.code = 'VALIDATION';
    err.status = 400;
    throw err;
  }
  if (role === ROLES.SYSTEM_ADMIN && !isSystemAdmin(actor)) {
    const err = new Error('Только system_admin может назначать роль system_admin');
    err.code = 'FORBIDDEN';
    err.status = 403;
    throw err;
  }
  return role;
}

/** Target user должен быть в той же lab (через employee.lab_id), кроме system_admin */
function assertActorCanManageUser(actor, targetUser, action = 'управления пользователем') {
  if (skipLabScope(actor)) return;
  const targetLab =
    targetUser.employee?.lab_id ??
    targetUser.employee?.get?.('lab_id') ??
    null;
  assertLabAccess(actor, targetLab, action);
}

/**
 * Создание пользователя (фаза 1 + 6a).
 *
 * Публичная регистрация: роль всегда student — role из req.body игнорируется.
 * Админ-создание (context.actor + allowPrivilegedRole): можно задать role / employee_id
 * с проверкой, что lab_admin не выдаёт system_admin и не цепляет чужой employee.
 *
 * context.forceRole — внутренний обход для сидеров.
 */
const createUser = async (data, meta, context = {}) => {
  try {
    const existing = await User.findOne({ where: { email: data.email } });
    if (existing) {
      throw new Error('Пользователь с таким email уже существует');
    }

    let role = DEFAULT_REGISTER_ROLE;
    let employeeId = data.employee_id ?? null;

    if (context.forceRole && context.allowPrivilegedRole) {
      role = context.forceRole;
    } else if (context.actor && context.allowPrivilegedRole) {
      const assigned = resolveAssignableRole(context.actor, data.role);
      role = assigned || DEFAULT_REGISTER_ROLE;

      if (employeeId != null) {
        const { Employee } = require('../models');
        const employee = await Employee.findByPk(employeeId);
        if (!employee) {
          const err = new Error(`Сотрудник с id ${employeeId} не найден`);
          err.status = 404;
          throw err;
        }
        assertLabAccess(
          context.actor,
          employee.lab_id,
          'привязки пользователя к сотруднику'
        );
      }
    }

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      employee_id: employeeId,
      role,
    });

    await logService.recordAuditLog({
      action: logService.LOG_ACTIONS.REGISTER,
      userId: context.actor?.id ?? user.id,
      resourceType: 'User',
      resourceId: user.id,
      description: `Пользователь с email ${user.email} зарегистрирован (role=${user.role})`,
      status: logService.LOG_STATUS.SUCCESS,
      ...logService.mergeMeta(meta),
    });
    console.log('Пользователь успешно создан:', toPublicUser(user));

    return toPublicUser(user);
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
    await logService.recordAuditLog({
      action: logService.LOG_ACTIONS.REGISTER_FAILED,
      userId: context.actor?.id ?? null,
      description: `Ошибка при регистрации: ${error.message}`,
      status: logService.LOG_STATUS.FAILED,
      ...logService.mergeMeta(meta),
    });
    throw error;
  }
};

/**
 * Фаза 6a: system_admin — все; lab_admin — только users с employee.lab_id = своя lab.
 */
const getAllUsers = async (actor) => {
  try {
    const employeeInclude = {
      association: 'employee',
      required: false,
    };

    if (!skipLabScope(actor)) {
      const labId = resolveActorLabId(actor);
      employeeInclude.required = true;
      employeeInclude.where = { lab_id: labId == null ? -1 : labId };
    }

    return await User.findAll({
      include: [employeeInclude],
      attributes: { exclude: ['password'] },
    });
  } catch (error) {
    console.error('Ошибка при получении списка пользователей:', error);
    throw error;
  }
};

const getUserById = async (id, actor) => {
  try {
    const user = await User.findByPk(id, {
      include: { association: 'employee' },
      attributes: { exclude: ['password'] },
    });
    if (!user) {
      throw new Error(`Пользователь с id ${id} не найден`);
    }
    if (actor !== undefined) {
      assertActorCanManageUser(actor, user, 'просмотра пользователя');
    }
    return user;
  } catch (error) {
    console.error('Ошибка при получении пользователя по id:', error);
    throw error;
  }
};

const updateUser = async (id, data, actor) => {
  try {
    const user = await User.findByPk(id, {
      include: { association: 'employee' },
    });
    if (!user) {
      throw new Error(`Пользователь с id ${id} не найден`);
    }
    if (actor !== undefined) {
      assertActorCanManageUser(actor, user, 'изменения пользователя');
    }

    const payload = { ...data };
    if (Object.prototype.hasOwnProperty.call(payload, 'role')) {
      const nextRole = resolveAssignableRole(actor, payload.role);
      if (nextRole == null) {
        delete payload.role;
      } else {
        payload.role = nextRole;
      }
    }

    if (payload.employee_id != null && actor) {
      const { Employee } = require('../models');
      const employee = await Employee.findByPk(payload.employee_id);
      if (!employee) {
        const err = new Error(`Сотрудник с id ${payload.employee_id} не найден`);
        err.status = 404;
        throw err;
      }
      assertLabAccess(actor, employee.lab_id, 'привязки пользователя к сотруднику');
    }

    await user.update(payload);
    return toPublicUser(user);
  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error);
    throw error;
  }
};

const deleteUser = async (id, actor) => {
  try {
    const user = await User.findByPk(id, {
      include: { association: 'employee' },
    });
    if (!user) {
      throw new Error(`Пользователь с id ${id} не найден`);
    }
    if (actor !== undefined) {
      assertActorCanManageUser(actor, user, 'удаления пользователя');
    }
    await user.destroy();
    return { message: `Пользователь с id ${id} удален` };
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error);
    throw error;
  }
};

/**
 * Login (фаза 3): bcrypt → JWT с role + laboratory_id.
 * Не логируем пароль/хеш в консоль.
 */
const loginUser = async (email, password, meta = {}) => {
  try {
    const user = await User.findOne({
      where: { email },
      include: [USER_LAB_INCLUDE],
    });

    if (!user) {
      await logService.recordAuditLog({
        action: logService.LOG_ACTIONS.LOGIN_FAILED,
        userId: null,
        description: `Попытка входа с несуществующим email: ${email}`,
        status: logService.LOG_STATUS.FAILED,
        ...logService.mergeMeta(meta),
      });
      throw new Error('Пользователь не найден, неверный email');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await logService.recordAuditLog({
        action: logService.LOG_ACTIONS.LOGIN_FAILED,
        userId: user.id,
        description: `Неверный пароль для пользователя с email: ${email}`,
        status: logService.LOG_STATUS.FAILED,
        ...logService.mergeMeta(meta),
      });
      throw new Error('Неверный пароль для пользователя');
    }

    user.setDataValue('updatedAt', new Date());
    await user.save();

    const token = signAccessToken(user);
    const authUser = toAuthUser(user);

    await logService.recordAuditLog({
      action: logService.LOG_ACTIONS.LOGIN,
      userId: user.id,
      resourceType: 'User',
      resourceId: user.id,
      description: `Пользователь ${user.email} вошёл (role=${authUser.role}, lab=${authUser.laboratory_id})`,
      status: logService.LOG_STATUS.SUCCESS,
      ...logService.mergeMeta(meta),
    });

    return { token, user: authUser };
  } catch (error) {
    console.error('Ошибка при авторизации пользователя:', error.message);
    throw error;
  }
};

/**
 * GET profile: свежие role / laboratory_id / roleLabel из БД (+ employee.laboratory).
 */
const getProfile = async (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      include: [USER_LAB_INCLUDE],
    });

    if (!user) {
      throw new Error('Пользователь не найден');
    }

    return toAuthUser(user);
  } catch (error) {
    console.error('Ошибка при получении профиля пользователя:', error.message);
    throw new Error('Не удалось получить профиль');
  }
};

/** Update authenticated user profile (name, email, optional password) */
const updateProfile = async (token, data = {}) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      include: [USER_LAB_INCLUDE],
    });
    if (!user) {
      throw new Error('Пользователь не найден');
    }

    const updates = {};
    if (data.name != null && String(data.name).trim()) {
      updates.name = String(data.name).trim();
    }
    if (data.email != null && String(data.email).trim()) {
      const nextEmail = String(data.email).trim().toLowerCase();
      if (nextEmail !== user.email) {
        const existing = await User.findOne({ where: { email: nextEmail } });
        if (existing && existing.id !== user.id) {
          throw new Error('Пользователь с таким email уже существует');
        }
      }
      updates.email = nextEmail;
    }

    if (data.password) {
      const currentPassword = data.currentPassword || '';
      if (!currentPassword) {
        throw new Error('Укажите текущий пароль для смены пароля');
      }
      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        throw new Error('Неверный текущий пароль');
      }
      if (String(data.password).length < 6) {
        throw new Error('Новый пароль должен быть не короче 6 символов');
      }
      updates.password = data.password;
    }

    // role с клиента в профиль не принимаем
    if (!Object.keys(updates).length) {
      throw new Error('Нет данных для обновления');
    }

    await user.update(updates);
    await user.reload({ include: [USER_LAB_INCLUDE] });

    return toAuthUser(user);
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw new Error('Токен недействителен');
    }
    console.error('Ошибка при обновлении профиля:', error.message);
    throw error;
  }
};

const logoutUser = async (userId, meta = {}) => {
  try {
    await logService.recordAuditLog({
      action: logService.LOG_ACTIONS.LOGOUT,
      userId,
      resourceType: 'User',
      resourceId: userId,
      description: 'Пользователь вышел из системы',
      status: logService.LOG_STATUS.SUCCESS,
      ...logService.mergeMeta(meta),
    });
    return { message: 'Выход из системы успешно залогирован' };
  } catch (error) {
    console.error('Ошибка при логировании выхода:', error);
    throw new Error('Ошибка при логировании выхода');
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  getProfile,
  updateProfile,
  logoutUser,
  toPublicUser,
  toAuthUser,
  buildTokenPayload,
  resolveLaboratoryId,
};
