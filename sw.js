/* Retires the service worker of the previous website. The current site does not use a service worker.
   On update this worker activates, deletes every cache, unregisters itself and does nothing else. */
self.addEventListener('install', function () {
  self.skipWaiting();
});
self.addEventListener('activate', function (event) {
  event.waitUntil((async function () {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map(function (k) { return caches.delete(k); }));
    } catch (e) { /* no caches */ }
    await self.registration.unregister();
  })());
});
/* No fetch handler: every request goes to the network. */
