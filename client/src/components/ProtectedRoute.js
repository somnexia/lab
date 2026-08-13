import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * Доступ только для авторизованных пользователей.
 * Гостей перенаправляет на /management/signin с return URL.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="auth-gate auth-gate--loading" role="status" aria-live="polite">
        <p className="auth-gate__text">Checking session…</p>
      </div>
    );
  }

  if (!user) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/management/signin?redirect=${redirect}`} replace />;
  }

  return children;
};

export default ProtectedRoute;
