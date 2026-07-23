// Service worker Push-Up — à placer à la racine du site, au même niveau que le fichier .html
// (le scope d'enregistrement suit l'emplacement de ce fichier).

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Reçoit la notification envoyée par le serveur (voir notifications-server-addon.js)
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: 'Push-Up', body: event.data ? event.data.text() : '' };
  }

  const title = data.title || 'Push-Up';
  const options = {
    body: data.body || '',
    icon: data.icon || 'logo.jpg',
    badge: data.badge || 'logo.jpg',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Ouvre (ou remet au premier plan) l'app quand on tape sur la notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })
  );
});
