/**
 * GET /api/test-push?token=ADMIN_SECRET
 * Envía una notificación de prueba a todos los suscritos (para verificar que push funciona).
 */

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  return res;
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const token = req.query.token || '';
  const secret = process.env.ADMIN_SECRET;
  if (!secret || token !== secret) {
    return res.status(401).json({ ok: false, error: 'Invalid token' });
  }

  const appId = process.env.ONE_SIGNAL_APP_ID;
  const apiKey = process.env.ONE_SIGNAL_API_KEY;
  if (!appId || !apiKey) {
    return res.status(200).json({ ok: false, error: 'ONE_SIGNAL_APP_ID or ONE_SIGNAL_API_KEY not set in Vercel' });
  }

  const sendToSegments = async (segments) => {
    const notifRes = await fetch('https://api.onesignal.com/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Key ${apiKey}`,
      },
      body: JSON.stringify({
        app_id: appId,
        included_segments: segments,
        target_channel: 'push',
        headings: { en: 'Prueba Trusted Home Services' },
        contents: { en: 'Si ves esto, las notificaciones push están funcionando.' },
      }),
    });
    return notifRes.json().catch(() => ({}));
  };

  try {
    // Enviar a ambos segmentos a la vez: quien esté en Subscribed Users o en Test Users recibe la notificación
    const data = await sendToSegments(['Subscribed Users', 'Test Users']);
    if (data.errors && data.errors.length) {
      return res.status(200).json({
        ok: false,
        error: data.errors[0] + ' (El dashboard puede mostrar 1 suscriptor pero el segmento push puede estar vacío. Añade tu dispositivo a Test Subscriptions en OneSignal → Audience y prueba de nuevo.)',
      });
    }
    if (!data.id) {
      return res.status(200).json({
        ok: false,
        error: 'OneSignal no creó el envío. En Audience → tu suscripción → 3 puntos → Add to Test Subscriptions, luego envía de nuevo la prueba.',
      });
    }
    return res.status(200).json({ ok: true, message: 'Notificación enviada. Revisa la esquina de la pantalla o el centro de notificaciones.', id: data.id });
  } catch (e) {
    return res.status(200).json({ ok: false, error: e.message || 'Request failed' });
  }
}
