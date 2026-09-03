const { User, Employee } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const logService = require('./logService');
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key'; // Убедитесь, что SECRET_KEY определен
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const { DEFAULT_REGISTER_ROLE } = require('../config/roles');

function toPublicUser(user) {
  const plain = user.get ? user.get({ plain: true }) : { ...user };
  delete plain.password;
  return plain;
}

/**
 * Создание пользователя (фаза 1).
 *
 * Публичная регистрация: роль всегда student — role из req.body игнорируется.
 * Права на назначение других ролей: CAN_MANAGE_USERS в config/roles.js (фаза 2).
 * Навесить authorize на админ-создание учёток — фазы 4 и 6.
 *
 * context.forceRole — внутренний обход для сидеров/админ-API (пока не используется с роутов).
 */
const createUser = async (data, meta, context = {}) => {
  try {
    const existing = await User.findOne({ where: { email: data.email } });
    if (existing) {
      throw new Error('Пользователь с таким email уже существует');
    }

    const role =
      context.forceRole && context.allowPrivilegedRole
        ? context.forceRole
        : DEFAULT_REGISTER_ROLE;

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      employee_id: data.employee_id ?? null,
      role,
    });

    await logService.recordAuditLog({
      action: logService.LOG_ACTIONS.REGISTER,
      userId: user.id,
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
      userId: null,
      description: `Ошибка при регистрации: ${error.message}`,
      status: logService.LOG_STATUS.FAILED,
      ...logService.mergeMeta(meta),
    });
    throw error;
  }
};

// Получение всех пользователей с включением связанных данных (например, Employee)
const getAllUsers = async () => {
  try {
    return await User.findAll({
      include: { association: 'employee' }, // Связь с Employee
    });
  } catch (error) {
    console.error('Ошибка при получении списка пользователей:', error);
    throw error;
  }
};

// Получение пользователя по ID
const getUserById = async (id) => {
  try {
    const user = await User.findByPk(id, {
      include: { association: 'employee' },
    });
    if (!user) {
      throw new Error(`Пользователь с id ${id} не найден`);
    }
    return user;
  } catch (error) {
    console.error('Ошибка при получении пользователя по id:', error);
    throw error;
  }
};

// Обновление данных пользователя по ID
const updateUser = async (id, data) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error(`Пользователь с id ${id} не найден`);
    }
    await user.update(data);
    return user;
  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error);
    throw error;
  }
};

// Удаление пользователя по ID
const deleteUser = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error(`Пользователь с id ${id} не найден`);
    }
    await user.destroy();
    return { message: `Пользователь с id ${id} удален` };
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error);
    throw error;
  }
};
// аутентификация — проверка email и пароля, и выдача JWT токена. После этого пользователь считается «вошедшим».
const loginUser = async (email, password, meta = {}) => {
  try {
    // Проверка существования пользователя
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Логируем неудачную попытку входа
      await logService.recordAuditLog({
        action: logService.LOG_ACTIONS.LOGIN_FAILED,
        userId: null,
        description: `Попытка входа с несуществующим email: ${email}`,
        status: logService.LOG_STATUS.FAILED,
        ...logService.mergeMeta(meta),
      });
      console.error('Пользователь не найден, неверный email');
      throw new Error('Пользователь не найден, неверный email');
    }

    // Проверка пароля
    console.log('Введённый пароль:', password);
    console.log('Хеш из базы:', user.password);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Пароль верен?', isPasswordValid);
    if (!isPasswordValid) {
      // Логируем неправильный пароль
      await logService.recordAuditLog({
        action: logService.LOG_ACTIONS.LOGIN_FAILED,
        userId: user.id,
        description: `Неверный пароль для пользователя с email: ${email}`,
        status: logService.LOG_STATUS.FAILED,
        ...logService.mergeMeta(meta),
      });
      console.error('Неверный пароль для пользователя');
      throw new Error('Неверный пароль для пользователя');
    }
    // Обновляем время последнего входа
    user.setDataValue('updatedAt', new Date());
    await user.save();


    // Генерация токена (используем секретный ключ)
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' } // Токен действителен 1 час
    );
    // Логируем успешный вход
    await logService.recordAuditLog({
      action: logService.LOG_ACTIONS.LOGIN,
      userId: user.id,
      resourceType: 'User',
      resourceId: user.id,
      description: `Пользователь с email ${user.email} вошёл в систему`,
      status: logService.LOG_STATUS.SUCCESS,
      ...logService.mergeMeta(meta),
    });

    // Возвращаем токен и данные пользователя
    console.log('Пользователь успешно вошёл в систему:', user);
    return { token, user };
  } catch (error) {
    console.error('Ошибка при авторизации пользователя:', error);
    throw error;
  }
};

const getProfile = async (token) => {
  try {
    // Декодируем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const userId = decoded.id;
    console.log(decoded);

    // Получаем пользователя по ID
    const user = await User.findByPk(userId, {
      include: [
        {
          association: 'employee',
          include: [{ association: 'laboratory', required: false }],
        },
      ],
    });

    if (!user) {
      throw new Error('Пользователь не найден');
    }

    return toPublicUser(user);
  } catch (error) {
    console.error('Ошибка при получении профиля пользователя:', error);
    throw new Error('Не удалось получить профиль');
  }
};

/** Update authenticated user profile (name, email, optional password) */
const updateProfile = async (token, data = {}) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      include: { association: 'employee', include: [{ association: 'laboratory', required: false }] },
    });
    if (!user) {
      throw new Error('Пользователь не найден');
    }

    const updates = {};
    if (data.name != null && String(data.name).trim()) {
      updates.name = String(data.name).trim();
    }
    if (data.email != null && String(data.email).trim()) {
      const email = String(data.email).trim().toLowerCase();
      if (email !== user.email) {
        const existing = await User.findOne({ where: { email } });
        if (existing && existing.id !== user.id) {
          throw new Error('Пользователь с таким email уже существует');
        }
      }
      updates.email = email;
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

    if (!Object.keys(updates).length) {
      throw new Error('Нет данных для обновления');
    }

    await user.update(updates);
    await user.reload({
      include: { association: 'employee', include: [{ association: 'laboratory', required: false }] },
    });

    return toPublicUser(user);
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw new Error('Токен недействителен');
    }
    console.error('Ошибка при обновлении профиля:', error);
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
};
