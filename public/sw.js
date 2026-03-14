self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
// No fetch listener: let all requests (including POST /api/submit) go to the network.

self.addEventListener('push', function (event) {
  if (!event.data) return;
  let title = 'Trusted Home Services';
  let body = 'New form submission';
  try {
    const data = event.data.json();
    if (data.title) title = data.title;
    if (data.body) body = data.body;
  } catch (_) {
    body = event.data.text();
  }
  const options = {
    body: body,
    icon: '/images/Logo%20v4.0%20Inverted.jpg',
    badge: '/images/Logo%20v4.0%20Inverted.jpg',
    tag: 'ths-form',
    requireInteraction: false,
    data: { url: '/#admin' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const url = event.notification.data && event.notification.data.url ? event.notification.data.url : '/#admin';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (let i = 0; i < clientList.length; i++) {
        if (clientList[i].url.indexOf(self.registration.scope) !== -1 && 'focus' in clientList[i]) {
          clientList[i].navigate(url);
          return clientList[i].focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
