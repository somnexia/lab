/**
 * Общий «хвост» для Access denied: interceptor (403) и RequirePerm пишут сюда,
 * страница /access-denied читает и показывает человеку.
 */

const STORAGE_KEY = 'labAccessDenied';

/**
 * @param {{
 *   message?: string,
 *   code?: string,
 *   from?: string,
 *   source?: 'api' | 'route',
 *   requiredPerms?: string[],
 * }} payload
 */
export function rememberAccessDenied(payload) {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        message: payload.message || 'Недостаточно прав',
        code: payload.code || 'FORBIDDEN',
        from: payload.from || '/',
        source: payload.source || 'api',
        requiredPerms: payload.requiredPerms || [],
        at: Date.now(),
      })
    );
  } catch {
    /* private mode / quota — страница покажет дефолтный текст */
  }
}

/** @returns {null | {
 *   message: string,
 *   code: string,
 *   from: string,
 *   source: string,
 *   requiredPerms: string[],
 *   at: number,
 * }} */
export function readAccessDenied() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearAccessDenied() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Редирект на UI отказа (полный assign — как у 401 в http.js).
 * @param {{ from?: string, message?: string, code?: string, source?: string, requiredPerms?: string[] }} opts
 */
export function goToAccessDenied(opts = {}) {
  const from =
    opts.from ||
    `${window.location.pathname}${window.location.search}` ||
    '/';

  rememberAccessDenied({
    message: opts.message,
    code: opts.code,
    from,
    source: opts.source || 'api',
    requiredPerms: opts.requiredPerms,
  });

  if (window.location.pathname.startsWith('/access-denied')) {
    return;
  }

  const qs = new URLSearchParams();
  qs.set('from', from);
  if (opts.code) qs.set('code', opts.code);
  window.location.assign(`/access-denied?${qs.toString()}`);
}
