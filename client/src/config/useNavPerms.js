/**
 * Удобный хук к navPerms из AuthContext.
 * @example
 *   const { perms, can } = useNavPerms();
 *   if (can('showUserLog')) …
 */
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { emptyNavPerms } from './navPerms';

export function useNavPerms() {
  const ctx = useContext(AuthContext);
  const perms = ctx?.perms || emptyNavPerms();
  const can = ctx?.can || ((key) => Boolean(perms[key]));
  return {
    user: ctx?.user ?? null,
    perms,
    can,
    loading: Boolean(ctx?.loading),
    isAuthenticated: Boolean(ctx?.isAuthenticated),
  };
}

export default useNavPerms;
