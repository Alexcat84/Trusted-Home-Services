/**
 * POST /api/admin/login
 * Body: { username, password }
 * Returns: { token } (JWT) or 401
 * Env: ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_SECRET (for signing JWT)
 */

export default async function handler(req, res) {
  const { adminCors } = await import('../../server-lib/cors.js');
  adminCors(req, res, 'POST, OPTIONS', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { checkRateLimit } = await import('../../server-lib/rate-limit.js');
  const rl = await checkRateLimit(req, 'login', 5, 900);
  if (!rl.allowed) {
    res.setHeader('Retry-After', String(rl.retryAfter ?? 900));
    return res.status(429).json({ error: 'Too many login attempts. Try again later.' });
  }

  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SECRET;

  if (!username || !password || !secret) {
    return res.status(500).json({ error: 'Server misconfiguration: set ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_SECRET in Vercel.' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const { username: u, password: p } = body || {};
  if (!u || !p) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  if (u !== username || p !== password) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const { signJWT } = await import('../../server-lib/auth.js');
  const token = signJWT({ admin: true }, secret);

  return res.status(200).json({ token });
}
