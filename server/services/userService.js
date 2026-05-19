const { User, Employee } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const logService = require('./logService');
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key'; // Убедитесь, что SECRET_KEY определен
// Создание нового пользователя
const createUser = async (data, meta, context = {}) => {
  try {
    const existing = await User.findOne({ where: { email: data.email } });
    if (existing) {
      throw new Error('Пользователь с таким email уже существует');
    }
    const user = await User.create(data);


    // Логирование события регистрации
    await logService.recordAuditLog({
      action: logService.LOG_ACTIONS.REGISTER,
      userId: user.id,
      resourceType: 'User',
      resourceId: user.id,
      description: `Пользователь с email ${user.email} зарегистрирован`,
      status: logService.LOG_STATUS.SUCCESS,
      ...logService.mergeMeta(meta),
    });
    console.log('Пользователь успешно создан:', user);


    return user;
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
      include: { association: 'employee' }, // Если нужно включить данные из связи с Employee
    });

    if (!user) {
      throw new Error('Пользователь не найден');
    }

    return user;
  } catch (error) {
    console.error('Ошибка при получении профиля пользователя:', error);
    throw new Error('Не удалось получить профиль');
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
  logoutUser,
};
