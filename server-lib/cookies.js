export function parseCookies(req) {
  const header = req.headers?.cookie;
  if (!header || typeof header !== 'string') return {};
  return Object.fromEntries(
    header.split(';').flatMap((part) => {
      const trimmed = part.trim();
      if (!trimmed) return [];
      const eq = trimmed.indexOf('=');
      if (eq <= 0) return [];
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      try {
        return [[key, decodeURIComponent(value)]];
      } catch {
        return [[key, value]];
      }
    })
  );
}

export function isProductionEnv() {
  return process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
}

import { ADMIN_SESSION_TTL_SECONDS } from './admin-session.js';

export function setAdminSessionCookie(res, token) {
  const secure = isProductionEnv() ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `th_admin=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${ADMIN_SESSION_TTL_SECONDS}${secure}`
  );
}

export function clearAdminSessionCookie(res) {
  const secure = isProductionEnv() ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `th_admin=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`
  );
}
