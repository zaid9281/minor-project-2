const CACHE_NAME = 'soet-portal-v1';
const OFFLINE_URL = '/offline.html';

// Files to cache immediately on install: static assets only
const PRECACHE_ASSETS = [
  '/css/main.css',
  '/js/main.js',
  // '/offline.html',
  // '/icons/icon-192.png',
  // '/icons/icon-512.png'
];

// Install: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch: network first, fallback to cache, fallback to offline page
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle GET requests
  if (req.method !== 'GET') return;

  // Never cache API/data endpoints
  const skipCache = [
    '/notifications/', '/bookmarks/ids', '/ratings/',
    '/announcements/latest-banner', '/student/track-download',
    '/auth/', '/admin/'
  ];

  if (skipCache.some((p) => req.url.includes(p))) {
    event.respondWith(fetch(req).catch(() => caches.match(req)));
    return;
  }

  // Static assets: cache first
  if (req.url.includes('/css/') || req.url.includes('/js/') || req.url.includes('/icons/')) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          return res;
        });
      })
    );
    return;
  }

  // Page navigations: network first, offline page fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // Default: network first, cache fallback
  event.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});
