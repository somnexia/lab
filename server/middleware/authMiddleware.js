const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

/** Маршруты API, доступные без Bearer-токена */
const PUBLIC_API_ROUTES = [
  { method: 'POST', path: '/api/users/login' },
  { method: 'POST', path: '/api/users' },
];

function normalizePath(url) {
  const withoutQuery = url.split('?')[0];
  if (withoutQuery.length > 1 && withoutQuery.endsWith('/')) {
    return withoutQuery.slice(0, -1);
  }
  return withoutQuery;
}

function isPublicApiRoute(req) {
  const path = normalizePath(req.originalUrl);
  return PUBLIC_API_ROUTES.some(
    (route) => route.method === req.method && route.path === path
  );
}

/**
 * Сейчас (фазы 1–2): только «есть валидный JWT или нет».
 * Роли и CAN_* живут в config/roles.js, но сюда ещё не подключены.
 *
 * Фаза 4: authenticate (Cookie || Bearer) + authorize(CAN_VIEW_LOGS) и т.д.
 * Фаза 3: в JWT появятся role и laboratory_id → класть их в req.user.
 *
 * Требует валидный JWT в Authorization: Bearer <token>.
 * Кладёт req.auth = { userId, email } для контроллеров.
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

  if (!token) {
    return res.status(401).json({
      message: 'Требуется авторизация',
      code: 'AUTH_REQUIRED',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.auth = { userId: decoded.id, email: decoded.email };
    req.userId = decoded.id;
    return next();
  } catch (error) {
    const message =
      error.name === 'TokenExpiredError'
        ? 'Сессия истекла, войдите снова'
        : 'Токен недействителен';
    return res.status(401).json({ message, code: 'AUTH_INVALID' });
  }
}

/** Глобальная защита всех /api/*, кроме login и регистрации */
function protectApiRoutes(req, res, next) {
  if (req.method === 'OPTIONS') {
    return next();
  }

  if (!req.originalUrl.startsWith('/api')) {
    return next();
  }

  if (isPublicApiRoute(req)) {
    return next();
  }

  return requireAuth(req, res, next);
}

module.exports = {
  requireAuth,
  protectApiRoutes,
  isPublicApiRoute,
};
