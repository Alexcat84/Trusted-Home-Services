/**
 * GET /api/admin/session
 * Returns { ok: true } when the HttpOnly admin cookie or Bearer JWT is valid.
 */

export default async function handler(req, res) {
  const { adminCors } = await import('../../server-lib/cors.js');
  adminCors(req, res, 'GET, OPTIONS', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { verifyAdminRequest } = await import('../../server-lib/admin-auth.js');
  if (!(await verifyAdminRequest(req))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return res.status(200).json({ ok: true });
}
