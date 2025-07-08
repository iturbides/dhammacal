const CACHE_NAME = 'dhamma-cache-v1.3';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/becss.css',
  '/app.js',
  '/manifest.json',
  '/mahanikaya.csv',
  '/images/favicon.ico',
  '/images/favicon-32.png',
  '/images/favicon-16.png',
  '/images/github.svg',
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

