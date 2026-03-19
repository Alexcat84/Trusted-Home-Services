/**
 * Send a notification via Notify.Events.
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
    const r = await fetch(url, { method: 'POST', body: form });
    if (!r.ok) console.error('Notify.Events error:', r.status);
  } catch (e) {
    console.error('Notify.Events request error:', e.message);
  }
}

export async function sendAdminNotifyEvents(type, payload) {
  const typeLabel = type === 'realtor' ? 'Realtor' : type === 'franchise' ? 'Franchise' : type === 'partner' ? 'Partner' : 'Quote';
  const title = `New: ${typeLabel} – Trusted Home Services`;
  const name = payload.name || 'No name';
  const lines = [
    `Type: ${typeLabel}`,
    `Name: ${name}`,
    `Email: ${payload.email || '–'}`,
    `Phone: ${payload.phone || '–'}`,
    type === 'quote'
      ? `Work: ${payload.work || '–'} | Areas: ${payload.areas || '–'} | Property type: ${payload.propertyType || '–'} | Size: ${payload.size || '–'}`
      : `Message: ${payload.message || '–'}`,
  ];
  const content = lines.join('\n');
  await sendNotifyEvents(title, content, { priority: 'high', level: 'notice' });
}
