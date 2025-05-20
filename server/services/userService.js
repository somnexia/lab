const { User, Employee, Log  } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key'; // Убедитесь, что SECRET_KEY определен
// Создание нового пользователя
const createUser = async (data, context = {}) => {
  try {
    const user = await User.create(data);

    // Логирование события регистрации
    await Log.create({
      user_id: user.id,
      action: 'REGISTER',
      description: `Пользователь с email ${user.email} зарегистрирован`,
      timestamp: new Date(),
      ip_address: context.ip || null,
      user_agent: context.userAgent || null,
      session_id: context.sessionId || null,
    });

    return user;
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
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
const loginUser = async (email, password) => {
  try {
    // Проверка существования пользователя
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.error('Пользователь не найден');
      throw new Error('Неверный email или пароль');
    }

    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.error('Неверный пароль');
      throw new Error('Неверный email или пароль');
    }

    user.setDataValue('updatedAt', new Date());
    await user.save();


    // Генерация токена (используем секретный ключ)
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' } // Токен действителен 1 час
    );

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

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  getProfile,
};
