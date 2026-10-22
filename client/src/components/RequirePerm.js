import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * Защита маршрута по флагу из navPerms (например canViewLogs).
 *
 * Скрыть пункт в меню недостаточно: URL можно ввести вручную.
 * Этот компонент — второй слой на клиенте; настоящая граница — authorize на API.
 *
 * @param {string|string[]} perm — ключ(и) в perms; достаточно одного из массива
 * @param {string} [fallback='/'] — куда увести при отказе
 * @param {React.ReactNode} children — страница
 */
function RequirePerm({ perm, fallback = '/', children }) {
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
    return <Navigate to={fallback} replace state={{ deniedPath: location.pathname }} />;
  }

  return children;
}

export default RequirePerm;
