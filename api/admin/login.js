/**
 * POST /api/admin/login
 * Body: { username, password }
 * Returns: { token } (JWT) or 401
 * Env: ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_SECRET (for signing JWT)
 */

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  return res;
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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

  const { signJWT } = await import('../lib/auth.js');
  const token = signJWT({ admin: true }, secret);

  return res.status(200).json({ token });
}
