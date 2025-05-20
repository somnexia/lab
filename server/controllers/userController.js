const userService = require('../services/userService');

// Создание нового пользователя
const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      sessionId: null, // можно будет заменить на реальный ID, если добавишь сессии
    });
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
  try {
    const { token, user } = await userService.loginUser(email, password);
    res.status(200).json({ message: 'Авторизация успешна', token, user });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  // Проверяем наличие токена в заголовке Authorization
  const token = req.headers.authorization?.split(' ')[1]; // Извлекаем токен из заголовка

  if (!token) {
    return res.status(401).json({ message: 'Токен не предоставлен' });
  }

  try {
    const user = await userService.getProfile(token); // Передаем токен в сервис для получения профиля
    res.status(200).json(user);
  } catch (error) {
    console.error('Ошибка при получении профиля:', error);
    res.status(404).json({ message: error.message || 'Не удалось получить профиль' });
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
