/**
 * Send a notification via Notify.Events (one source → email, SMS, push, Telegram, etc.).
 * Set NOTIFY_EVENTS_SOURCE_TOKEN to the source token from your channel
 * (e.g. from "Incoming Webhook v2" or "Node.js" source).
 * API: POST https://notify.events/api/v1/channel/source/{token}/execute (multipart: title, content, priority, level)
 */

const EXECUTE_URL = 'https://notify.events/api/v1/channel/source';

export async function sendNotifyEvents(title, content, options = {}) {
  const token = process.env.NOTIFY_EVENTS_SOURCE_TOKEN;
  if (!token || !title) return;

  const priority = options.priority ?? 'normal';
  const level = options.level ?? 'info';

  const form = new FormData();
  form.append('title', String(title));
  form.append('content', String(content));
  form.append('priority', priority);
  form.append('level', level);

  try {
    const url = token.startsWith('http') ? token : `${EXECUTE_URL}/${token.replace(/\/$/, '')}/execute`;
    const r = await fetch(url, {
      method: 'POST',
      body: form,
    });
    if (!r.ok) console.error('Notify.Events error:', r.status, await r.text());
  } catch (e) {
    console.error('Notify.Events request error:', e.message);
  }
}

export async function sendAdminNotifyEvents(type, payload) {
  const typeLabel = type === 'realtor' ? 'Realtor / Agente' : type === 'franchise' ? 'Franquicia' : type === 'partner' ? 'Partner' : 'Cotización';
  const title = `Nuevo: ${typeLabel} – Trusted Home Services`;
  const name = payload.name || 'Sin nombre';
  const lines = [
    `Tipo: ${typeLabel}`,
    `Nombre: ${name}`,
    `Email: ${payload.email || '–'}`,
    `Teléfono: ${payload.phone || '–'}`,
    type === 'quote'
      ? `Trabajo: ${payload.work || '–'} | Áreas: ${payload.areas || '–'} | Propiedad: ${payload.propertyType || '–'} | Tamaño: ${payload.size || '–'}`
      : `Mensaje: ${payload.message || '–'}`,
  ];
  const content = lines.join('\n');
  await sendNotifyEvents(title, content, { priority: 'high', level: 'notice' });
}
