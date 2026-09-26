/**
 * NIVIS - Offline Expedition Service Worker
 * Kutup sahasında sıfır internet ile %100 çevrimdışı çalışma garantisi.
 */

const CACHE_NAME = 'nivis-cache-v2.0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './src/engine.js',
  './src/ui.js',
  './src/qr.js',
  './qrcode.min.js',
  './jsqr.min.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    }).catch(() => {
      return caches.match('./index.html');
    })
  );
});
