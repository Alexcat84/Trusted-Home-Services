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

  const sendToSegment = async (segment) => {
    const notifRes = await fetch('https://api.onesignal.com/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Key ${apiKey}`,
      },
      body: JSON.stringify({
        app_id: appId,
        included_segments: [segment],
        target_channel: 'push',
        headings: { en: 'Prueba Trusted Home Services' },
        contents: { en: 'Si ves esto, las notificaciones push están funcionando.' },
      }),
    });
    return notifRes.json().catch(() => ({}));
  };

  try {
    let data = await sendToSegment('Subscribed Users');
    if (data.errors && data.errors.length) {
      return res.status(200).json({ ok: false, error: data.errors[0] || 'OneSignal error' });
    }
    if (!data.id) {
      data = await sendToSegment('Test Users');
      if (data.errors && data.errors.length) {
        return res.status(200).json({ ok: false, error: data.errors[0] || 'OneSignal error' });
      }
      if (!data.id) {
        return res.status(200).json({
          ok: false,
          error: 'No hay suscriptores en "Subscribed Users" ni en "Test Users". En OneSignal → Audience, localiza tu suscripción, clic en los 3 puntos → "Add to Test Subscriptions". Luego envía de nuevo la prueba.',
        });
      }
      return res.status(200).json({
        ok: true,
        message: 'Notificación enviada a Test Users. Revisa la esquina de la pantalla o el centro de notificaciones.',
        id: data.id,
      });
    }
    return res.status(200).json({ ok: true, message: 'Notificación enviada. Revisa la esquina de la pantalla o el centro de notificaciones.', id: data.id });
  } catch (e) {
    return res.status(200).json({ ok: false, error: e.message || 'Request failed' });
  }
}
