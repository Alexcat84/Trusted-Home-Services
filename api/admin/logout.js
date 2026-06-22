/**
 * POST /api/admin/logout
 * Clears the HttpOnly admin session cookie.
 */

export default async function handler(req, res) {
  const { adminCors } = await import('../../server-lib/cors.js');
  adminCors(req, res, 'POST, OPTIONS', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { clearAdminSessionCookie } = await import('../../server-lib/cookies.js');
  clearAdminSessionCookie(res);

  return res.status(200).json({ ok: true });
}
