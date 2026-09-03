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
 * Фаза 3: JWT несёт role, laboratory_id, employee_id.
 * Кладём их в req.user / req.auth для будущих authorize и tenant-scope.
 *
 * Фаза 4: Cookie || Bearer + authorize(CAN_*).
 *
 * Старые токены без role: req.user.role будет undefined → нужна перелогинка.
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

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      laboratory_id:
        decoded.laboratory_id === undefined || decoded.laboratory_id === null
          ? null
          : Number(decoded.laboratory_id),
      employee_id:
        decoded.employee_id === undefined || decoded.employee_id === null
          ? null
          : Number(decoded.employee_id),
    };

    req.auth = {
      userId: decoded.id,
      email: decoded.email,
      role: decoded.role,
      laboratory_id: req.user.laboratory_id,
      employee_id: req.user.employee_id,
    };
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
