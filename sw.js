// Service Worker for Jurney Explorer (Standalone App Support)

const CACHE_NAME = 'jurney-v3.3.4';

const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/theme.js',
  '/icon.png',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // v3.3.4 (Build 2026.04.09)
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
