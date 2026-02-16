/**
 * GET /api/submissions?token=ADMIN_SECRET
 * Returns latest submissions (newest first). Reads from Prisma if DATABASE_URL set, else KV.
 */

const KV_KEY = 'submissions';
const DEFAULT_LIMIT = 100;

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  return res;
}

function toAdminShape(row) {
  return {
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
  };
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const token = req.query.token || req.headers.authorization?.replace(/^Bearer\s+/i, '');
  const secret = process.env.ADMIN_SECRET;
  if (!secret || token !== secret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

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
  if (!kvUrl || !kvToken) {
    return res.status(200).json({ submissions: [] });
  }

  try {
    const { kv } = await import('@vercel/kv');
    const raw = await kv.lrange(KV_KEY, 0, limit - 1);
    const submissions = raw
      .map((s) => {
        try {
          return typeof s === 'string' ? JSON.parse(s) : s;
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
