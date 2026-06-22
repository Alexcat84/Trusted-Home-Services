import { parseCookies } from './cookies.js';

export function getAdminToken(req) {
  const authHeader = req.headers?.authorization?.replace(/^Bearer\s+/i, '').trim();
  if (authHeader) return authHeader;

  const cookies = parseCookies(req);
  return cookies.th_admin || null;
}

export async function verifyAdminRequest(req) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;

  const token = getAdminToken(req);
  if (!token) return false;

  const { verifyJWT } = await import('./auth.js');
  const payload = verifyJWT(token, secret);
  return !!(payload && payload.admin === true);
}
