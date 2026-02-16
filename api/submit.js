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

  let stored = false;
  const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (dbUrl) {
    try {
      const { prisma } = await import('./lib/prisma.js');
      await prisma.submission.create({
        data: {
          type,
          name: body.name ?? '',
          email: body.email ?? null,
          phone: body.phone ?? null,
          message: body.message ?? null,
          work: body.work ?? null,
          areas: body.areas ?? null,
          propertyType: body.propertyType ?? null,
          size: body.size ?? null,
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

  await sendAdminEmail(type, body);

  return res.status(200).json({ ok: true });
}
