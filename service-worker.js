const CACHE_NAME = "snake-game-cache-v1";
const CACHE_NAME = "snake-game-cache-v1";
const urlsToCache = [
  "/snake/",
  "/snake/index.html",
  "/snake/style.css",
  "/snake/script.js",
  "/snake/manifest.json",
  "/snake/icons/icon-192x192.png",
  "/snake/icons/icon-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        }),
      ),
    ),
  );
});
