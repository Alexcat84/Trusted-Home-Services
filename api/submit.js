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
  if (!appId || !apiKey) {
    console.error('OneSignal: missing ONE_SIGNAL_APP_ID or ONE_SIGNAL_API_KEY');
    return;
  }

  const isRealtor = type === 'realtor';
  const title = isRealtor ? 'Nuevo contacto (agente)' : 'Nueva solicitud de cotización';
  const name = payload.name || 'Sin nombre';
  const body = isRealtor
    ? `${name} – ${payload.email || payload.phone || ''}`
    : `${name} – ${payload.work || 'cotización'}`;

  try {
    const notifRes = await fetch('https://api.onesignal.com/notifications', {
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
    if (!notifRes.ok) {
      const errText = await notifRes.text();
      console.error('OneSignal API error:', notifRes.status, errText);
    }
  } catch (e) {
    console.error('OneSignal error:', e.message);
  }
}

async function sendAdminEmail(type, payload) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_EMAIL;
  const from = process.env.NOTIFY_FROM_EMAIL || 'Trusted Home Services <onboarding@resend.dev>';
  if (!apiKey || !to) return;

  const isRealtor = type === 'realtor';
  const subject = isRealtor ? 'Nuevo contacto (agente) – Trusted Home Services' : 'Nueva cotización – Trusted Home Services';
  const name = payload.name || 'Sin nombre';
  const lines = [
    `Tipo: ${isRealtor ? 'Realtor / Agente' : 'Cotización'}`,
    `Nombre: ${name}`,
    `Email: ${payload.email || '–'}`,
    `Teléfono: ${payload.phone || '–'}`,
    isRealtor ? `Mensaje: ${payload.message || '–'}` : `Trabajo: ${payload.work || '–'}\nÁreas: ${payload.areas || '–'}\nTipo propiedad: ${payload.propertyType || '–'}\nTamaño: ${payload.size || '–'}`,
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
  await sendAdminEmail(type, body);

  return res.status(200).json({ ok: true });
}
