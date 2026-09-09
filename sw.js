const CACHE_NAME = 'ti68k-touch-v19';
const ASSETS = [
  './', './index.html', './manifest.webmanifest', './icon.svg', './icon-180.png',
  './v13_readable.js?v=skin-pro', './v12rom.js', './v12sav.js', './Ti-92plus.png', './voyage200-pro-skin.png',
  './ti89_skinmap.gif', './ti89t_skinmap.gif', './ti92p_skinmap.gif', './tiv200_skinmap.gif'
];

self.addEventListener('install', event => event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(response => response).catch(() => caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok && new URL(event.request.url).origin === location.origin) caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
    return response;
  })));
});
