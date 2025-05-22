const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
// Создание нового пользователя
const createUser = async (req, res) => {
  try {
    // const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const ipList = req.headers['x-forwarded-for']?.split(',') || [];
    const ip = ipList[0]?.trim() || req.ip;
    const userAgent = req.headers['user-agent'];
    const sessionId = req.session?.id || null; // если у тебя используется express-session

    const user = await userService.createUser(req.body, {
      ip,
      userAgent,
      sessionId,
    });
    console.log('Создан новый пользователь:', user);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Получение всех пользователей
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Получение пользователя по ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Обновление пользователя
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.updateUser(id, req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Удаление пользователя
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userService.deleteUser(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const ipList = req.headers['x-forwarded-for']?.split(',') || [];
  const ip = ipList[0]?.trim() || req.ip;
  const userAgent = req.headers['user-agent'];
  const sessionId = req.session?.id || null;
  try {
    const { token, user } = await userService.loginUser(email, password, {
      ip,
      userAgent,
      sessionId,
    });
    res.status(200).json({ message: 'Авторизация успешна', token, user });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  // Проверяем наличие токена в заголовке Authorization
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Токен не предоставлен или недействителен' });
  }

  try {
    const user = await userService.getProfile(token); // Передаем токен в сервис для получения профиля
    res.status(200).json(user);
  } catch (error) {
    console.error('Ошибка при получении профиля:', error);
    res.status(404).json({ message: error.message || 'Не удалось получить профиль' });
  }
};

const logoutUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Токен не предоставлен' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const userId = decoded.id;

    const ipList = req.headers['x-forwarded-for']?.split(',') || [];
    const ip = ipList[0]?.trim() || req.ip;
    const userAgent = req.headers['user-agent'];
    const sessionId = req.session?.id || null;

    await userService.logoutUser(userId, {
      ip,
      userAgent,
      sessionId,
    });

    res.status(200).json({ message: 'Пользователь вышел из системы' });
  } catch (error) {
    console.error('Ошибка при выходе из системы:', error);
    res.status(500).json({ message: 'Ошибка при выходе' });
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
  logoutUser
};
