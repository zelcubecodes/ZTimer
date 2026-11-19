/* ZTimer Web service worker: lets the timer open offline. Copyright (C) 2026 Zel (ZelCubes), GPL-3.0.
   Network first, so a new upload shows up straight away; the cache is only used when you are offline. */
var CACHE = 'ztimer-web-zt12';
var FILES = ['./', 'index.html', 'cstimer.js', 'twisty.js', 'jquery.min.js', 'style.css', 'ztimer-theme.css', 'ztimer-icons.css', 'ztimer-ui.js', 'Quicksand_Medium.ttf', 'Quicksand_Bold.ttf', 'en-us.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) {
    return Promise.all(FILES.map(function(f) { return c.add(f).catch(function() {}); }));
  }).then(function() { return self.skipWaiting(); }));
});

self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
  }).then(function() { return self.clients.claim(); }));
});

self.addEventListener('fetch', function(e) {
  var r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) { return; }
  e.respondWith(fetch(r).then(function(res) {
    var copy = res.clone();
    caches.open(CACHE).then(function(c) { c.put(r, copy); });
    return res;
  }).catch(function() {
    return caches.match(r).then(function(m) { return m || caches.match('index.html'); });
  }));
});
