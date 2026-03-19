import { sendAdminSms } from './sms.js';
import { sendPushToAll } from './push.js';
import { sendAdminNotifyEvents } from './notify-events.js';

const DEFAULT_FLAGS = { email: true, sms: true };

function getStatusCode(err) {
  return err?.statusCode ?? err?.status ?? err?.response?.status ?? null;
}

export async function getNotificationFlags() {
  // Defaults if settings have never been saved.
  const defaults = { ...DEFAULT_FLAGS };

  const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (dbUrl) {
    try {
      const { prisma } = await import('./prisma.js');
      const row = await prisma.notificationSettings.findUnique({ where: { id: 'default' } });
      if (row) {
        return {
          email: typeof row.email === 'boolean' ? row.email : defaults.email,
          sms: typeof row.sms === 'boolean' ? row.sms : defaults.sms,
        };
      }
    } catch (e) {
      // No PII here; just surface the failure reason.
      console.error('NotificationFlags DB read error:', e.message);
    }
  }

  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;
  if (kvUrl && kvToken) {
    try {
      const { kv } = await import('@vercel/kv');
      const raw = await kv.get('notification_settings');
      if (raw) {
        const obj = typeof raw === 'string' ? JSON.parse(raw) : raw;
        return {
          email: typeof obj.email === 'boolean' ? obj.email : defaults.email,
          sms: typeof obj.sms === 'boolean' ? obj.sms : defaults.sms,
        };
      }
    } catch (e) {
      console.error('NotificationFlags KV read error:', e.message);
    }
  }

  return defaults;
}

export async function sendAdminEmail(type, payload) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_EMAIL;
  const from = process.env.NOTIFY_FROM_EMAIL || 'Trusted Home Services <onboarding@resend.dev>';
  if (!apiKey || !to) return;

  const typeLabel =
    type === 'realtor' ? 'Realtor' : type === 'franchise' ? 'Franchise' : type === 'partner' ? 'Partner' : 'Quote';
  const subject =
    type === 'realtor'
      ? 'New realtor contact – Trusted Home Services'
      : type === 'franchise'
        ? 'New franchise request – Trusted Home Services'
        : type === 'partner'
          ? 'New partner request – Trusted Home Services'
          : 'New quote – Trusted Home Services';

  // Used only to compose provider payload (allowed); do not log it.
  const name = payload?.name || 'No name';

  const lines = [
    `Type: ${typeLabel}`,
    `Name: ${name}`,
    `Email: ${payload.email || '–'}`,
    `Phone: ${payload.phone || '–'}`,
    type === 'realtor' || type === 'franchise' || type === 'partner'
      ? `Message: ${payload.message || '–'}`
      : `Work: ${payload.work || '–'}\nAreas: ${payload.areas || '–'}\nProperty type: ${payload.propertyType || '–'}\nSize: ${payload.size || '–'}`,
  ];

  const text = lines.join('\n');
  const html =
    '<p>' +
    lines
      .map((l) => l.replace(/&/g, '&amp;').replace(/</g, '&lt;'))
      .join('</p><p>') +
    '</p>';

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ from, to: [to], subject, html, text }),
    });

    if (!r.ok) {
      console.error('[submit] Resend email error type=', type, 'status=', r.status);
    } else {
      console.log('[submit] Resend OK type=', type);
    }
  } catch (e) {
    // Provider exceptions: log only status code (if available).
    const status = getStatusCode(e) ?? 'unknown';
    console.error('[submit] Resend exception type=', type, 'status=', status);
  }
}

export async function sendSubmissionNotifications(type, payload) {
  const flags = await getNotificationFlags().catch(() => ({ ...DEFAULT_FLAGS }));

  if (flags.email) {
    // sendAdminEmail handles its own errors; this is just extra safety.
    await sendAdminEmail(type, payload).catch((e) => {
      const status = getStatusCode(e) ?? 'unknown';
      console.error('[submit] Resend email error type=', type, 'status=', status);
    });
  } else {
    console.log('[submit] email skipped type=', type);
  }

  if (flags.sms) {
    await sendAdminSms(type, payload).catch((e) => {
      const status = getStatusCode(e) ?? 'unknown';
      console.error('[submit] SMS error type=', type, 'status=', status);
    });
  } else {
    console.log('[submit] SMS skipped type=', type);
  }

  await sendPushToAll(type, payload).catch((e) => {
    const status = getStatusCode(e) ?? 'unknown';
    console.error('[submit] Push error: status=', status);
  });
  console.log('[submit] push/Notify.Events invoked');

  await sendAdminNotifyEvents(type, payload).catch((e) => {
    const status = getStatusCode(e) ?? 'unknown';
    console.error('[submit] Notify.Events error:', 'status=', status);
  });
}

