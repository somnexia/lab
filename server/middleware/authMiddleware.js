const jwt = require('jsonwebtoken');
const { hasRole } = require('../config/roles');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

/** Имя httpOnly-cookie с JWT (фаза 4). Совместимо с booking-паттерном. */
const AUTH_COOKIE_NAME = 'token';

/** Срок cookie ≈ JWT (2h по умолчанию в userService). */
const AUTH_COOKIE_MAX_AGE_MS = 2 * 60 * 60 * 1000;

/** Маршруты API, доступные без токена */
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
 * Фаза 4: токен из cookie, иначе Authorization: Bearer.
 * React по-прежнему может слать Bearer; cookie — второй канал.
 */
function extractToken(req) {
  if (req.cookies && req.cookies[AUTH_COOKIE_NAME]) {
    return String(req.cookies[AUTH_COOKIE_NAME]).trim() || null;
  }
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim() || null;
  }
  return null;
}

function applyUserFromToken(req, decoded) {
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
}

/**
 * Set-Cookie после login (httpOnly — JS на странице cookie не читает).
 * sameSite=lax: достаточно для SPA на другом порту при credentials.
 */
function setAuthCookie(res, token) {
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: AUTH_COOKIE_MAX_AGE_MS,
    path: '/',
  });
}

function clearAuthCookie(res) {
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
}

/**
 * authenticate (фаза 4) — бывший requireAuth.
 * Cookie → иначе Bearer → req.user { id, email, role, laboratory_id, employee_id }.
 */
function authenticate(req, res, next) {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({
      message: 'Требуется авторизация',
      code: 'AUTH_REQUIRED',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    applyUserFromToken(req, decoded);
    return next();
  } catch (error) {
    const message =
      error.name === 'TokenExpiredError'
        ? 'Сессия истекла, войдите снова'
        : 'Токен недействителен';
    return res.status(401).json({ message, code: 'AUTH_INVALID' });
  }
}

/** @deprecated имя; используйте authenticate */
const requireAuth = authenticate;

/**
 * authorize(CAN_*) — 403, если роли нет в списке.
 * Вызывать после authenticate (глобальный protectApiRoutes или локально).
 *
 * Пример: router.get('/', authorize(CAN_VIEW_LOGS), controller.getLogs)
 */
function authorize(allowedRoles = []) {
  const list = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Требуется авторизация',
        code: 'AUTH_REQUIRED',
      });
    }

    if (list.length && !hasRole(req.user, list)) {
      return res.status(403).json({
        message: 'Недостаточно прав',
        code: 'FORBIDDEN',
        required: list,
        role: req.user.role || null,
      });
    }

    return next();
  };
}

/** Глобально: все /api/* кроме login/register требуют authenticate */
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

  return authenticate(req, res, next);
}

module.exports = {
  AUTH_COOKIE_NAME,
  extractToken,
  setAuthCookie,
  clearAuthCookie,
  authenticate,
  requireAuth,
  authorize,
  protectApiRoutes,
  isPublicApiRoute,
};
