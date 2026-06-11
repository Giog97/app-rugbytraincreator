/* Service worker: cache dell'app shell per uso offline.
   I dati (esercizi, sedute) stanno in IndexedDB, non qui. */
var CACHE = 'rugbytrain-v7';
var ASSETS = [
  '.',
  'index.html',
  'manifest.webmanifest',
  'css/styles.css?v=7',
  'js/vendor/jspdf.umd.min.js',
  'js/config.js?v=7',
  'js/db.js?v=7',
  'js/catalog.js?v=7',
  'js/plays.js?v=7',
  'js/tips.js?v=7',
  'js/pdf.js?v=7',
  'js/app.js?v=7',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      // cache:'reload' bypassa la cache HTTP del browser: in cache va la versione fresca dal server
      return Promise.all(ASSETS.map(function (u) {
        return fetch(new Request(u, { cache: 'reload' })).then(function (res) {
          if (!res || res.status !== 200) throw new Error('asset ' + u);
          return c.put(u, res);
        });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) { if (k !== CACHE) return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      if (hit) return hit;
      return fetch(e.request).then(function (res) {
        // metti in cache le richieste same-origin riuscite
        if (res && res.status === 200 && e.request.url.indexOf(self.location.origin) === 0) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        }
        return res;
      }).catch(function () { return caches.match('index.html'); });
    })
  );
});
