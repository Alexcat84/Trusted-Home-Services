/**
 * Send push notifications to all stored admin subscriptions.
 */
export async function sendPushToAll(type, payload) {
  const vapidPublic = process.env.VAPID_PUBLIC_KEY;
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
  if (!vapidPublic || !vapidPrivate) return;

  const typeLabel = type === 'realtor' ? 'Realtor partner' : type === 'franchise' ? 'Franchise' : type === 'partner' ? 'Partner' : 'Quote';
  const name = payload.name || 'No name';
  const title = `New: ${typeLabel}`;
  const body = `${name} – ${payload.email || payload.phone || 'no contact'}`.slice(0, 100);

  let subscriptions = [];
  const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (dbUrl) {
    try {
      const { prisma } = await import('./prisma.js');
      const rows = await prisma.pushSubscription.findMany();
      subscriptions = rows.map((r) => ({
        endpoint: r.endpoint,
        keys: { p256dh: r.keysP256dh, auth: r.keysAuth },
      }));
    } catch (e) {
      console.error('Push fetch Prisma error');
      return;
    }
  } else {
    const kvUrl = process.env.KV_REST_API_URL;
    const kvToken = process.env.KV_REST_API_TOKEN;
    if (!kvUrl || !kvToken) return;
    try {
      const { kv } = await import('@vercel/kv');
      const raw = await kv.get('push_subscriptions');
      const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
      subscriptions = list
        .map((s) => {
          try {
            const o = typeof s === 'string' ? JSON.parse(s) : s;
            return o.endpoint && o.keys ? { endpoint: o.endpoint, keys: o.keys } : null;
          } catch {
            return null;
          }
        })
        .filter(Boolean);
    } catch (e) {
      console.error('Push fetch KV error');
      return;
    }
  }

  if (subscriptions.length === 0) return;

  const webpush = (await import('web-push')).default;
  webpush.setVapidDetails(
    process.env.VAPID_MAILTO || 'mailto:info@trustedhomeservices.ca',
    vapidPublic,
    vapidPrivate
  );

  const payloadStr = JSON.stringify({ title, body });
  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(sub, payloadStr, { TTL: 60 });
    } catch (e) {
      if (e.statusCode === 410 || e.statusCode === 404) {
        try {
          if (dbUrl) {
            const { prisma } = await import('./prisma.js');
            await prisma.pushSubscription.deleteMany({ where: { endpoint: sub.endpoint } });
          } else {
            const { kv } = await import('@vercel/kv');
            const raw = await kv.get('push_subscriptions');
            const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
            const filtered = list.filter((s) => {
              const o = typeof s === 'string' ? JSON.parse(s) : s;
              return o.endpoint !== sub.endpoint;
            });
            await kv.set('push_subscriptions', filtered);
          }
        } catch (_) {}
      }
      console.error('Push send error:', e.statusCode ?? 'unknown');
    }
  }
}
