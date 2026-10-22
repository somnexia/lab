import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Показать children только если у пользователя есть флаг(и) в navPerms.
 * Для кнопок/ссылок на странице (не для целых маршрутов — см. RequirePerm).
 *
 * @example
 *   <Can perm="showRegisterLot">
 *     <Link to="...">Register lot</Link>
 *   </Can>
 *
 * @param {string|string[]} perm
 * @param {React.ReactNode} [fallback=null] — что показать, если права нет
 */
function Can({ perm, children, fallback = null }) {
  const { perms } = useContext(AuthContext);
  const keys = Array.isArray(perm) ? perm : [perm];
  const allowed = keys.some((key) => Boolean(perms && perms[key]));

  if (!allowed) {
    return fallback;
  }

  return children;
}

export default Can;
