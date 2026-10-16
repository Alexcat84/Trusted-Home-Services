// The service worker exists so the admin panel installs as an app. It has no
// fetch listener on purpose: every request, POST /api/submit included, goes
// straight to the network. Push notifications were handled here once; that
// channel was never configured and has been removed, leaving email.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
