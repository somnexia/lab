import React, { useContext, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { clearAccessDenied, readAccessDenied } from '../utils/accessDenied';

/**
 * Мягкий экран только для чувствительных admin-маршрутов
 * (сейчас: /management/userlog). Обычные «нет права создать лот» —
 * тихий redirect через RequirePerm deny="redirect".
 */
function AccessDeniedPage() {
  const { user, perms } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const details = useMemo(() => {
    const stored = readAccessDenied();
    const params = new URLSearchParams(location.search);
    const state = location.state || {};

    return {
      message:
        state.message ||
        stored?.message ||
        'Этот раздел предназначен для администраторов лаборатории.',
      from:
        state.deniedPath ||
        params.get('from') ||
        stored?.from ||
        '/',
      requiredPerms: state.requiredPerms || stored?.requiredPerms || [],
    };
  }, [location]);

  const roleLabel = perms?.roleLabel || user?.roleLabel || user?.role || '—';

  const handleGoHome = () => {
    clearAccessDenied();
    navigate('/', { replace: true });
  };

  return (
    <section className="access-denied" aria-labelledby="access-denied-title">
      <div className="access-denied__card">
        <p className="access-denied__eyebrow">Admin area</p>
        <h1 id="access-denied-title" className="access-denied__title">
          Section unavailable
        </h1>
        <p className="access-denied__lead">{details.message}</p>

        <dl className="access-denied__meta">
          <div className="access-denied__meta-row">
            <dt>Signed in as</dt>
            <dd>{roleLabel}</dd>
          </div>
          <div className="access-denied__meta-row">
            <dt>Link opened</dt>
            <dd>
              <code className="access-denied__path">{details.from}</code>
            </dd>
          </div>
        </dl>

        <p className="access-denied__hint">
          Если ссылку прислали коллеги — попросите администратора выдать доступ
          или откройте нужный раздел из меню слева.
        </p>

        <div className="access-denied__actions">
          <button
            type="button"
            className="access-denied__btn access-denied__btn--primary"
            onClick={handleGoHome}
          >
            Back to dashboard
          </button>
          <Link
            to="/customer/profile"
            className="access-denied__btn access-denied__btn--ghost"
            onClick={clearAccessDenied}
          >
            My profile
          </Link>
        </div>
      </div>
    </section>
  );
}

export default AccessDeniedPage;
