const userService = require('../services/userService');
const {
  extractToken,
  setAuthCookie,
  clearAuthCookie,
} = require('../middleware/authMiddleware');
const { isScopeForbidden } = require('../utils/labScope');

function sendUserError(res, error, fallbackStatus = 400) {
  if (isScopeForbidden(error) || error.code === 'FORBIDDEN') {
    return res.status(403).json({ error: error.message, code: error.code || 'FORBIDDEN' });
  }
  if (error.status === 404 || /не найден/i.test(error.message || '')) {
    return res.status(404).json({ error: error.message });
  }
  if (error.code === 'VALIDATION' || error.status === 400) {
    return res.status(400).json({ error: error.message });
  }
  console.error(error);
  return res.status(fallbackStatus).json({ error: error.message });
}

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

/**
 * Фаза 6a: POST /api/users/managed — создание учётки админом.
 * authorize(CAN_MANAGE_USERS) на роуте; роль/employee_id проверяются в сервисе.
 */
const createManagedUser = async (req, res) => {
  try {
    const ipList = req.headers['x-forwarded-for']?.split(',') || [];
    const ip = ipList[0]?.trim() || req.ip;
    const userAgent = req.headers['user-agent'];
    const sessionId = req.session?.id || null;

    const user = await userService.createUser(
      req.body,
      { ip, userAgent, sessionId },
      { actor: req.user, allowPrivilegedRole: true }
    );
    return res.status(201).json(user);
  } catch (error) {
    return sendUserError(res, error);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers(req.user);
    res.status(200).json(users);
  } catch (error) {
    return sendUserError(res, error);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id, req.user);
    res.status(200).json(user);
  } catch (error) {
    return sendUserError(res, error);
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body, req.user);
    res.status(200).json(user);
  } catch (error) {
    return sendUserError(res, error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.id, req.user);
    res.status(200).json(result);
  } catch (error) {
    return sendUserError(res, error);
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
  createManagedUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  getProfile,
  updateProfile,
  logoutUser,
};
