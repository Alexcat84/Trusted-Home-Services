/**
 * POST /api/push-subscribe
 * Body: { subscription: { endpoint, keys: { p256dh, auth } } }
 * Auth: token (admin JWT or ADMIN_SECRET)
 * Stores subscription for sending push when a form is submitted.
 */

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return res;
}

async function auth(req) {
  const token = req.query.token || req.headers.authorization?.replace(/^Bearer\s+/i, '');
  const secret = process.env.ADMIN_SECRET;
  if (!secret || !token) return false;
  if (token === secret) return true;
  if (token.includes('.') && token.split('.').length === 3) {
    const { verifyJWT } = await import('../server-lib/auth.js');
    const payload = verifyJWT(token, secret);
    return payload && payload.admin === true;
  }
  return false;
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!(await auth(req))) return res.status(401).json({ error: 'Unauthorized' });

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const sub = body.subscription;
  if (!sub || !sub.endpoint || !sub.keys || !sub.keys.p256dh || !sub.keys.auth) {
    return res.status(400).json({ error: 'Missing subscription.endpoint or subscription.keys.p256dh/auth' });
  }

  const userAgent = req.headers['user-agent'] || null;
  const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

  if (dbUrl) {
    try {
      const { prisma } = await import('../server-lib/prisma.js');
      await prisma.pushSubscription.upsert({
        where: { endpoint: sub.endpoint },
        create: {
          endpoint: sub.endpoint,
          keysP256dh: sub.keys.p256dh,
          keysAuth: sub.keys.auth,
          userAgent,
        },
        update: {
          keysP256dh: sub.keys.p256dh,
          keysAuth: sub.keys.auth,
          userAgent,
        },
      });
      return res.status(200).json({ ok: true });
    } catch (e) {
      console.error('Push subscribe Prisma error:', e.message);
      return res.status(500).json({ error: 'Storage error' });
    }
  }

  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;
  if (kvUrl && kvToken) {
    try {
      const { kv } = await import('@vercel/kv');
      const key = 'push_subscriptions';
      const raw = await kv.get(key);
      const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
      const without = list.filter((s) => {
        const o = typeof s === 'string' ? JSON.parse(s) : s;
        return o.endpoint !== sub.endpoint;
      });
      without.push({ ...sub, userAgent });
      await kv.set(key, without.slice(-100));
      return res.status(200).json({ ok: true });
    } catch (e) {
      console.error('Push subscribe KV error:', e.message);
      return res.status(500).json({ error: 'Storage error' });
    }
  }

  return res.status(503).json({ error: 'Configure POSTGRES_URL or KV to store push subscriptions.' });
}
