// Define a version number for your cache (increment this whenever you update your service worker)
const cacheVersion = 'v1';

// Files to cache
const filesToCache = [
  './', // The current directory (root)
  './main.html',
  './style.css',
  './main.js',
  './60bpm/'
];
// const noteNames = ['C', 'Dflat', 'D', 'Eflat', 'E', 'F', 'Gflat', 'G', 'Aflat', 'A', 'Bflat', 'B'];
// const octaves = [3, 4, 5]

// Event: Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheVersion)
      .then(cache => cache.addAll(filesToCache))
      .then(() => self.skipWaiting())
  );
});

// Event: Activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== cacheVersion) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Event: Fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }

        // If not found in cache, fetch from network
        return fetch(event.request);
      })
  );
});
