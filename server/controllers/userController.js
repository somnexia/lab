const userService = require('../services/userService');
const {
  extractToken,
  setAuthCookie,
  clearAuthCookie,
} = require('../middleware/authMiddleware');

/**
 * POST /api/users — публичная регистрация (фаза 1).
 * Тело может содержать role, но сервис принудительно ставит student.
 */
const createUser = async (req, res) => {
  try {
    const ipList = req.headers['x-forwarded-for']?.split(',') || [];
    const ip = ipList[0]?.trim() || req.ip;
    const userAgent = req.headers['user-agent'];
    const sessionId = req.session?.id || null;

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

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.updateUser(id, req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userService.deleteUser(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

/**
 * Login (фазы 3–4): JWT в JSON + httpOnly cookie.
 * Клиент может пользоваться Bearer из body и/или cookie (credentials).
 */
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
    setAuthCookie(res, token);
    res.status(200).json({ message: 'Авторизация успешна', token, user });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ message: 'Токен не предоставлен или недействителен' });
  }

  try {
    const user = await userService.updateProfile(token, req.body);
    res.status(200).json(user);
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error);
    res.status(400).json({ message: error.message || 'Не удалось обновить профиль' });
  }
};

const getProfile = async (req, res) => {
  // Cookie или Bearer — тот же extractToken, что и authenticate
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ message: 'Токен не предоставлен или недействителен' });
  }

  try {
    const user = await userService.getProfile(token);
    res.status(200).json(user);
  } catch (error) {
    console.error('Ошибка при получении профиля:', error);
    res.status(404).json({ message: error.message || 'Не удалось получить профиль' });
  }
};

const logoutUser = async (req, res) => {
  try {
    const token = extractToken(req);
    const ipList = req.headers['x-forwarded-for']?.split(',') || [];
    const ip = ipList[0]?.trim() || req.ip;
    const userAgent = req.headers['user-agent'];
    const sessionId = req.session?.id || null;

    // userId из authenticate (если был) или из токена
    let userId = req.user?.id ?? req.userId ?? null;
    if (!userId && token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        userId = decoded.id;
      } catch (_) {
        /* cookie/token уже невалиден — всё равно чистим cookie */
      }
    }

    if (userId) {
      await userService.logoutUser(userId, { ip, userAgent, sessionId });
    }

    clearAuthCookie(res);
    res.status(200).json({ message: 'Пользователь вышел из системы' });
  } catch (error) {
    console.error('Ошибка при выходе из системы:', error);
    clearAuthCookie(res);
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
  updateProfile,
  logoutUser,
};
