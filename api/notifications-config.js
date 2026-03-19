/**
 * GET /api/notifications-config
 * Returns which notification channels are configured (no secrets).
 * Use this to verify env vars in Vercel.
 */
import { publicCors } from '../server-lib/cors.js';

export default async function handler(req, res) {
  publicCors(req, res, 'GET, OPTIONS', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const email = !!(process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL);
  const sms = !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER && process.env.ADMIN_PHONE);
  const push = !!(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);
  const notifyEvents = !!process.env.NOTIFY_EVENTS_SOURCE_TOKEN;
  const storage = !!(process.env.POSTGRES_URL || process.env.DATABASE_URL || (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN));

  return res.status(200).json({
    storage,
    channels: { email, sms, push, notifyEvents },
    hint: 'All four form types (quote, realtor, partner, franchise) use POST /api/submit. If only one type gets notifications, the request for the others may not be reaching the API (check Network tab for POST /api/submit).',
  });
}
