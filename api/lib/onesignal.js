/**
 * Send a push notification via OneSignal to all subscribed users (e.g. admin).
 * Set ONE_SIGNAL_APP_ID and ONE_SIGNAL_REST_API_KEY in env.
 * Admin subscribes in the panel via OneSignal SDK; this sends to segment "All".
 * Docs: https://documentation.onesignal.com/reference/create-notification
 */

const ONESIGNAL_API = 'https://api.onesignal.com/notifications';

export async function sendOneSignalPush(type, payload) {
  const appId = process.env.ONE_SIGNAL_APP_ID;
  const apiKey = process.env.ONE_SIGNAL_REST_API_KEY;
  if (!appId || !apiKey) return;

  const typeLabel = type === 'realtor' ? 'Realtor / Agente' : type === 'franchise' ? 'Franquicia' : type === 'partner' ? 'Partner' : 'Cotización';
  const title = `Nuevo: ${typeLabel} – Trusted Home Services`;
  const name = payload.name || 'Sin nombre';
  const body = `${name} – ${payload.email || payload.phone || 'sin contacto'}`.slice(0, 120);

  const baseUrl = process.env.SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');
  const openUrl = baseUrl ? `${baseUrl}/#admin` : '/#admin';

  try {
    const r = await fetch(ONESIGNAL_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Key ${apiKey}`,
      },
      body: JSON.stringify({
        app_id: appId,
        target_channel: 'push',
        included_segments: ['All'],
        headings: { en: title },
        contents: { en: body },
        url: openUrl,
      }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) console.error('OneSignal error:', r.status, data);
  } catch (e) {
    console.error('OneSignal request error:', e.message);
  }
}
