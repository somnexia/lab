import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { rememberAccessDenied } from '../utils/accessDenied';

/**
 * Защита маршрута по флагу из navPerms.
 *
 * Два режима отказа (prop `deny`):
 *   "redirect" (по умолчанию) — тихий увод на соседнюю страницу
 *     (register lot → /inventory/lots). Без вспышки секретного UI.
 *   "page" — только для чувствительных admin-URL → /access-denied
 *
 * Пока loading — не рендерим children (иначе мелькает запрещённая страница).
 *
 * @param {string|string[]} perm
 * @param {string} [fallback='/'] — куда увести в режиме redirect
 * @param {'redirect'|'page'} [deny='redirect']
 */
function RequirePerm({ perm, fallback = '/', deny = 'redirect', children }) {
  const { perms, loading, user } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="auth-gate auth-gate--loading" role="status" aria-live="polite">
        <p className="auth-gate__text">Checking permissions…</p>
      </div>
    );
  }

  if (!user) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/management/signin?redirect=${redirect}`} replace />;
  }

  const keys = Array.isArray(perm) ? perm : [perm];
  const allowed = keys.some((key) => Boolean(perms && perms[key]));

  if (!allowed) {
    if (deny === 'page') {
      rememberAccessDenied({
        message: 'Этот раздел доступен только администраторам.',
        code: 'ROUTE_FORBIDDEN',
        from: location.pathname,
        source: 'route',
        requiredPerms: keys,
      });

      return (
        <Navigate
          to="/access-denied"
          replace
          state={{
            deniedPath: location.pathname,
            requiredPerms: keys,
            source: 'route',
            code: 'ROUTE_FORBIDDEN',
            message: 'Этот раздел доступен только администраторам.',
          }}
        />
      );
    }

    return (
      <Navigate
        to={fallback || '/'}
        replace
        state={{ deniedPath: location.pathname, softDenied: true }}
      />
    );
  }

  return children;
}

export default RequirePerm;
