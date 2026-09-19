// Service Worker for ApexSearch PWA
const CACHE_NAME = 'apexsearch-pwa-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './assets/icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => {
        if (k !== CACHE_NAME) return caches.delete(k);
      })
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Only handle local relative requests
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        return cached || fetch(event.request);
      })
    );
  }
});
