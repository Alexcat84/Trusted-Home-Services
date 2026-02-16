/**
 * POST /api/submit
 * Body: { type: 'realtor'|'quote', ...fields }
 * - Stores in Vercel KV (if KV_* env set)
 * - Sends OneSignal push (if ONE_SIGNAL_* env set)
 */

const KV_KEY = 'submissions';
const MAX_SUBMISSIONS = 500;

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  return res;
}

async function sendOneSignalPush(type, payload) {
  const appId = process.env.ONE_SIGNAL_APP_ID;
  const apiKey = process.env.ONE_SIGNAL_API_KEY;
  if (!appId || !apiKey) return;

  const isRealtor = type === 'realtor';
  const title = isRealtor ? 'Nuevo contacto (agente)' : 'Nueva solicitud de cotización';
  const name = payload.name || 'Sin nombre';
  const body = isRealtor
    ? `${name} – ${payload.email || payload.phone || ''}`
    : `${name} – ${payload.work || 'cotización'}`;

  try {
    await fetch('https://api.onesignal.com/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Key ${apiKey}`,
      },
      body: JSON.stringify({
        app_id: appId,
        included_segments: ['Subscribed Users'],
        target_channel: 'push',
        headings: { en: title },
        contents: { en: body },
      }),
    });
  } catch (e) {
    console.error('OneSignal error:', e.message);
  }
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const type = body.type === 'realtor' || body.type === 'quote' ? body.type : null;
  if (!type) return res.status(400).json({ error: 'Missing or invalid type' });

  const record = {
    type,
    ...body,
    _at: new Date().toISOString(),
  };

  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;
  if (kvUrl && kvToken) {
    try {
      const { kv } = await import('@vercel/kv');
      await kv.lpush(KV_KEY, JSON.stringify(record));
      await kv.ltrim(KV_KEY, 0, MAX_SUBMISSIONS - 1);
    } catch (e) {
      console.error('KV error:', e.message);
      return res.status(500).json({ error: 'Storage error' });
    }
  }

  await sendOneSignalPush(type, body);

  return res.status(200).json({ ok: true });
}
