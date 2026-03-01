/**
 * GET /api/push-vapid
 * Returns the VAPID public key for the client to subscribe to push.
 * No auth required (public key is not secret).
 */

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  return res;
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const publicKey = process.env.VAPID_PUBLIC_KEY;
  if (!publicKey) {
    return res.status(503).json({ error: 'Push not configured. Set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY.' });
  }
  return res.status(200).json({ publicKey });
}
