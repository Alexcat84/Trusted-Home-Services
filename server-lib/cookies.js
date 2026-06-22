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

export function setAdminSessionCookie(res, token) {
  const maxAge = 60 * 60 * 24 * 7;
  const secure = isProductionEnv() ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `th_admin=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`
  );
}

export function clearAdminSessionCookie(res) {
  const secure = isProductionEnv() ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `th_admin=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`
  );
}
