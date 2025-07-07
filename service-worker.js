const CACHE_NAME = 'dhamma-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/becss.css',
  '/app.js',
  '/manifest.json',
  '/images/favicon.ico',
  '/images/icon-192.png',
  '/images/icon-512.png',
  '/images/main-logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

