/**
 * GET /api/notifications-config
 * Says whether the one notification channel is configured. No secrets.
 * Use this to verify the env vars in Vercel.
 */
import { publicCors } from '../server-lib/cors.js';

export default async function handler(req, res) {
  publicCors(req, res, 'GET, OPTIONS', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const email = !!(process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL);
  const storage = !!(process.env.POSTGRES_URL || process.env.DATABASE_URL || (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN));

  return res.status(200).json({
    storage,
    channels: { email },
    hint: 'All four form types (quote, realtor, partner, franchise) use POST /api/submit. If only one type gets notifications, the request for the others may not be reaching the API (check the Network tab for POST /api/submit).',
  });
}
