/**
 * POST /api/submit
 * Body: { type: 'realtor'|'quote', ...fields }
 * - Stores in Prisma DB (if DATABASE_URL set) or Vercel KV (if KV_* set)
 * - Sends email alert (if RESEND_API_KEY + ADMIN_EMAIL set)
 */

const KV_KEY = 'submissions';
const MAX_SUBMISSIONS = 500;

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  return res;
}

async function getNotificationFlags() {
  // Defaults if settings have never been saved.
  const defaults = { email: true, sms: true };

  const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (dbUrl) {
    try {
      const { prisma } = await import('../server-lib/prisma.js');
      const row = await prisma.notificationSettings.findUnique({ where: { id: 'default' } });
      if (row) {
        return {
          email: typeof row.email === 'boolean' ? row.email : defaults.email,
          sms: typeof row.sms === 'boolean' ? row.sms : defaults.sms,
        };
      }
    } catch (e) {
      console.error('NotificationFlags DB read error:', e.message);
    }
  }

  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;
  if (kvUrl && kvToken) {
    try {
      const { kv } = await import('@vercel/kv');
      const raw = await kv.get('notification_settings');
      if (raw) {
        const obj = typeof raw === 'string' ? JSON.parse(raw) : raw;
        return {
          email: typeof obj.email === 'boolean' ? obj.email : defaults.email,
          sms: typeof obj.sms === 'boolean' ? obj.sms : defaults.sms,
        };
      }
    } catch (e) {
      console.error('NotificationFlags KV read error:', e.message);
    }
  }

  return defaults;
}

async function sendAdminEmail(type, payload) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_EMAIL;
  const from = process.env.NOTIFY_FROM_EMAIL || 'Trusted Home Services <onboarding@resend.dev>';
  if (!apiKey || !to) return;

  const typeLabel = type === 'realtor' ? 'Realtor' : type === 'franchise' ? 'Franchise' : type === 'partner' ? 'Partner' : 'Quote';
  const subject = type === 'realtor' ? 'New realtor contact – Trusted Home Services' : type === 'franchise' ? 'New franchise request – Trusted Home Services' : type === 'partner' ? 'New partner request – Trusted Home Services' : 'New quote – Trusted Home Services';
  const name = payload.name || 'No name';
  const lines = [
    `Type: ${typeLabel}`,
    `Name: ${name}`,
    `Email: ${payload.email || '–'}`,
    `Phone: ${payload.phone || '–'}`,
    (type === 'realtor' || type === 'franchise' || type === 'partner') ? `Message: ${payload.message || '–'}` : `Work: ${payload.work || '–'}\nAreas: ${payload.areas || '–'}\nProperty type: ${payload.propertyType || '–'}\nSize: ${payload.size || '–'}`,
  ];
  const text = lines.join('\n');
  const html = '<p>' + lines.map((l) => l.replace(/&/g, '&amp;').replace(/</g, '&lt;')).join('</p><p>') + '</p>';

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ from, to: [to], subject, html, text }),
    });
    if (!r.ok) console.error('Resend email error:', await r.text());
  } catch (e) {
    console.error('Resend error:', e.message);
  }
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { checkRateLimit } = await import('../server-lib/rate-limit.js');
  const rl = await checkRateLimit(req, 'submit', 10, 60);
  if (!rl.allowed) {
    res.setHeader('Retry-After', String(rl.retryAfter ?? 60));
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const type = (body.type === 'realtor' || body.type === 'quote' || body.type === 'franchise' || body.type === 'partner') ? body.type : null;
  if (!type) return res.status(400).json({ error: 'Missing or invalid type' });

  const LIMITS = { name: 200, email: 254, phone: 50, message: 5000, work: 5000, areas: 1000, propertyType: 200, size: 100 };
  const trim = (v, max) => (v == null ? v : String(v).trim().slice(0, max) || null);
  const name = trim(body.name ?? '', LIMITS.name);
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const email = trim(body.email, LIMITS.email);
  const phone = trim(body.phone, LIMITS.phone);
  const message = trim(body.message, LIMITS.message);
  const work = trim(body.work, LIMITS.work);
  const areas = trim(body.areas, LIMITS.areas);
  const propertyType = trim(body.propertyType, LIMITS.propertyType);
  const size = trim(body.size, LIMITS.size);

  const record = {
    type,
    name,
    email: email || null,
    phone: phone || null,
    message: message || null,
    work: work || null,
    areas: areas || null,
    propertyType: propertyType || null,
    size: size || null,
    _at: new Date().toISOString(),
  };

  let stored = false;
  const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (dbUrl) {
    try {
      const { prisma } = await import('../server-lib/prisma.js');
      await prisma.submission.create({
        data: {
          type,
          name,
          email: email || null,
          phone: phone || null,
          message: message || null,
          work: work || null,
          areas: areas || null,
          propertyType: propertyType || null,
          size: size || null,
        },
      });
      stored = true;
    } catch (e) {
      console.error('Prisma error:', e.message);
    }
  }
  if (!stored) {
    const kvUrl = process.env.KV_REST_API_URL;
    const kvToken = process.env.KV_REST_API_TOKEN;
    if (kvUrl && kvToken) {
      try {
        const { kv } = await import('@vercel/kv');
        await kv.lpush(KV_KEY, JSON.stringify(record));
        await kv.ltrim(KV_KEY, 0, MAX_SUBMISSIONS - 1);
        stored = true;
      } catch (e) {
        console.error('KV error:', e.message);
      }
    }
  }
  if (!stored) {
    return res.status(500).json({ error: 'Storage error. Configure POSTGRES_URL (and run: npx prisma db push) or KV in Vercel.' });
  }

  const flags = await getNotificationFlags().catch(() => ({ email: true, sms: true }));

  const payload = { name, email, phone, message, work, areas, propertyType, size };
  if (flags.email) {
    await sendAdminEmail(type, payload);
  }
  // Notifications are sent for all types: quote, realtor, partner, franchise.
  const { sendAdminSms } = await import('../server-lib/sms.js');
  const { sendPushToAll } = await import('../server-lib/push.js');
  const { sendAdminNotifyEvents } = await import('../server-lib/notify-events.js');
  if (flags.sms) {
    await sendAdminSms(type, payload).catch((e) => console.error('SMS:', e.message));
  }
  await sendPushToAll(type, payload).catch((e) => console.error('Push:', e.message));
  await sendAdminNotifyEvents(type, payload).catch((e) => console.error('Notify.Events:', e.message));

  return res.status(200).json({ ok: true });
}
