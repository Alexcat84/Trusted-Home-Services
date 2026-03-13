/**
 * GET /api/notification-settings  (Authorization: Bearer <JWT or ADMIN_SECRET>)
 *  -> { email: boolean, sms: boolean }
 * PATCH /api/notification-settings
 *  Body: { email?: boolean, sms?: boolean }
 *  Auth: token (admin JWT or ADMIN_SECRET)
 *
 * Uses Postgres (NotificationSettings table) when available; otherwise falls back
 * to Vercel KV under key "notification_settings". Defaults are email=true, sms=true.
 */

const KV_KEY = 'notification_settings';

async function cors(req, res) {
  const { adminCors } = await import('./lib/cors.js');
  return adminCors(req, res, 'GET, PATCH, OPTIONS', 'Content-Type, Authorization');
}

async function auth(req) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  const secret = process.env.ADMIN_SECRET;
  if (!secret || !token) return false;
  if (token === secret) return true;
  if (token.includes('.') && token.split('.').length === 3) {
    try {
      const { verifyJWT } = await import('./lib/auth.js');
      const payload = verifyJWT(token, secret);
      return payload && payload.admin === true;
    } catch {
      return false;
    }
  }
  return false;
}

const DEFAULT_FLAGS = { email: true, sms: true };

async function getFlagsFromDb() {
  const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!dbUrl) return null;
  try {
    const { prisma } = await import('./lib/prisma.js');
    const row = await prisma.notificationSettings.findUnique({ where: { id: 'default' } });
    if (!row) return null;
    return { email: !!row.email, sms: !!row.sms };
  } catch (e) {
    console.error('NotificationSettings DB read error:', e.message);
    return null;
  }
}

async function saveFlagsToDb(flags) {
  const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!dbUrl) return false;
  try {
    const { prisma } = await import('./lib/prisma.js');
    await prisma.notificationSettings.upsert({
      where: { id: 'default' },
      update: { email: flags.email, sms: flags.sms },
      create: { id: 'default', email: flags.email, sms: flags.sms },
    });
    return true;
  } catch (e) {
    console.error('NotificationSettings DB write error:', e.message);
    return false;
  }
}

async function getFlagsFromKv() {
  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;
  if (!kvUrl || !kvToken) return null;
  try {
    const { kv } = await import('@vercel/kv');
    const raw = await kv.get(KV_KEY);
    if (!raw) return null;
    const obj = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return {
      email: typeof obj.email === 'boolean' ? obj.email : DEFAULT_FLAGS.email,
      sms: typeof obj.sms === 'boolean' ? obj.sms : DEFAULT_FLAGS.sms,
    };
  } catch (e) {
    console.error('NotificationSettings KV read error:', e.message);
    return null;
  }
}

async function saveFlagsToKv(flags) {
  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;
  if (!kvUrl || !kvToken) return false;
  try {
    const { kv } = await import('@vercel/kv');
    await kv.set(KV_KEY, flags);
    return true;
  } catch (e) {
    console.error('NotificationSettings KV write error:', e.message);
    return false;
  }
}

async function getFlags() {
  const fromDb = await getFlagsFromDb();
  if (fromDb) return fromDb;
  const fromKv = await getFlagsFromKv();
  if (fromKv) return fromKv;
  return DEFAULT_FLAGS;
}

async function saveFlags(flags) {
  // Try DB first, then KV. If both fail, we still return flags but they won't persist.
  const savedDb = await saveFlagsToDb(flags);
  if (savedDb) return true;
  const savedKv = await saveFlagsToKv(flags);
  return savedKv;
}

export default async function handler(req, res) {
  await cors(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!(await auth(req))) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    const flags = await getFlags();
    return res.status(200).json(flags);
  }

  if (req.method === 'PATCH') {
    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch {
      return res.status(400).json({ error: 'Invalid JSON' });
    }
    const current = await getFlags();
    const next = {
      email: typeof body.email === 'boolean' ? body.email : current.email,
      sms: typeof body.sms === 'boolean' ? body.sms : current.sms,
    };
    await saveFlags(next);
    return res.status(200).json(next);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

