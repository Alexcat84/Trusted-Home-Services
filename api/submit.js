/**
 * POST /api/submit
 * Body: { type: 'realtor'|'quote'|'partner'|'franchise', name, email?, phone?, message?, work?, areas?, propertyType?, size? }
 *
 * Notifications are sent by THIS serverless function (Vercel). Same logic for all 4 types.
 * Config: Vercel project → Settings → Environment Variables.
 *
 * Storage (required): POSTGRES_URL or DATABASE_URL (Prisma), or KV_REST_API_URL + KV_REST_API_TOKEN.
 * Email: RESEND_API_KEY + ADMIN_EMAIL. Optional: NOTIFY_FROM_EMAIL.
 * SMS: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, ADMIN_PHONE.
 * Push: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY. Optional: VAPID_MAILTO.
 * Notify.Events: NOTIFY_EVENTS_SOURCE_TOKEN.
 *
 * Check config: GET /api/notifications-config returns which channels are set (no secrets).
 */

import { publicCors } from '../server-lib/cors.js';
import { sendSubmissionNotifications } from '../server-lib/notifications-sender.js';

const KV_KEY = 'submissions';
const MAX_SUBMISSIONS = 500;

export default async function handler(req, res) {
  publicCors(req, res, 'GET, POST, OPTIONS', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { checkRateLimit } = await import('../server-lib/rate-limit.js');
  const rl = await checkRateLimit(req, 'submit', 30, 60);
  if (!rl.allowed) {
    res.setHeader('Retry-After', String(rl.retryAfter ?? 60));
    return res.status(429).json({ error: 'Too many requests. Please try again in a minute.' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const type = (body.type === 'realtor' || body.type === 'quote' || body.type === 'franchise' || body.type === 'partner') ? body.type : null;
  if (!type) return res.status(400).json({ error: 'Missing or invalid type' });

  console.log('[submit] request type=', type);

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
      console.log('[submit] stored in DB (Prisma)');
    } catch (e) {
      console.error('[submit] Prisma error:', e.message);
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
        console.log('[submit] stored in KV');
      } catch (e) {
        console.error('[submit] KV error:', e.message);
      }
    }
  }
  if (!stored) {
    console.error('[submit] no storage configured (no POSTGRES_URL/DATABASE_URL and no KV)');
    return res.status(500).json({ error: 'Storage error. Configure POSTGRES_URL (and run: npx prisma db push) or KV in Vercel.' });
  }

  const payload = { name, email, phone, message, work, areas, propertyType, size };

  await sendSubmissionNotifications(type, payload);

  console.log('[submit] success 200 type=', type);
  return res.status(200).json({ ok: true, type });
}
