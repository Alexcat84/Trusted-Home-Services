/**
 * GET /api/submissions?token=ADMIN_SECRET — list
 * PATCH /api/submissions — body { id, status }
 * DELETE /api/submissions?id=xxx&token=xxx
 */

const KV_KEY = 'submissions';
const DEFAULT_LIMIT = 100;
const VALID_STATUSES = ['new', 'contacted', 'offer_sent', 'offer_accepted', 'offer_rejected', 'work_in_progress', 'work_done'];

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  return res;
}

async function auth(req) {
  const token = req.query.token || req.headers.authorization?.replace(/^Bearer\s+/i, '');
  const secret = process.env.ADMIN_SECRET;
  if (!secret || !token) return false;
  if (token === secret) return true;
  if (token.includes('.') && token.split('.').length === 3) {
    const { verifyJWT } = await import('./lib/auth.js');
    const payload = verifyJWT(token, secret);
    return payload && payload.admin === true;
  }
  return false;
}

const LEGACY_STATUS_MAP = { nuevo: 'new', tomado: 'contacted', en_proceso: 'work_in_progress', finalizado: 'work_done' };

function toAdminShape(row) {
  const rawStatus = row.status ?? 'new';
  const status = LEGACY_STATUS_MAP[rawStatus] || (VALID_STATUSES.includes(rawStatus) ? rawStatus : 'new');
  return {
    id: row.id,
    _at: row.createdAt?.toISOString?.() ?? row._at,
    type: row.type,
    name: row.name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    work: row.work,
    areas: row.areas,
    propertyType: row.propertyType,
    size: row.size,
    status,
  };
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!(await auth(req))) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    const limit = Math.min(parseInt(req.query.limit, 10) || DEFAULT_LIMIT, 500);
    const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (dbUrl) {
      try {
        const { prisma } = await import('./lib/prisma.js');
        const rows = await prisma.submission.findMany({
          orderBy: { createdAt: 'desc' },
          take: limit,
        });
        const submissions = rows.map(toAdminShape);
        return res.status(200).json({ submissions });
      } catch (e) {
        console.error('Prisma submissions error:', e.message);
        return res.status(500).json({ error: 'Storage error' });
      }
    }
    const kvUrl = process.env.KV_REST_API_URL;
    const kvToken = process.env.KV_REST_API_TOKEN;
    if (!kvUrl || !kvToken) return res.status(200).json({ submissions: [] });
    try {
      const { kv } = await import('@vercel/kv');
      const raw = await kv.lrange(KV_KEY, 0, limit - 1);
      const submissions = raw
        .map((s) => {
          try {
            const item = typeof s === 'string' ? JSON.parse(s) : s;
            return { ...toAdminShape({ ...item, id: item.id || null, createdAt: item._at ? new Date(item._at) : null }), id: item.id || null };
          } catch {
            return null;
          }
        })
        .filter(Boolean);
      return res.status(200).json({ submissions });
    } catch (e) {
      console.error('KV submissions error:', e.message);
      return res.status(500).json({ error: 'Storage error' });
    }
  }

  if (req.method === 'PATCH') {
    const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (!dbUrl) return res.status(501).json({ error: 'Update only supported with Postgres' });
    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch {
      return res.status(400).json({ error: 'Invalid JSON' });
    }
    const { id, status } = body || {};
    if (!id || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Missing id or invalid status' });
    }
    try {
      const { prisma } = await import('./lib/prisma.js');
      await prisma.submission.update({
        where: { id },
        data: { status },
      });
      return res.status(200).json({ ok: true });
    } catch (e) {
      if (e.code === 'P2025') return res.status(404).json({ error: 'Not found' });
      console.error('Prisma update error:', e.message);
      return res.status(500).json({ error: 'Update failed' });
    }
  }

  if (req.method === 'DELETE') {
    const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (!dbUrl) return res.status(501).json({ error: 'Delete only supported with Postgres' });
    const id = req.query.id;
    if (!id) return res.status(400).json({ error: 'Missing id' });
    try {
      const { prisma } = await import('./lib/prisma.js');
      await prisma.submission.delete({ where: { id } });
      return res.status(200).json({ ok: true });
    } catch (e) {
      if (e.code === 'P2025') return res.status(404).json({ error: 'Not found' });
      console.error('Prisma delete error:', e.message);
      return res.status(500).json({ error: 'Delete failed' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
