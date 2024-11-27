console.log("sevice worker working!")
self.addEventListener('install', (event:ExtendableEvent) => {
    event.waitUntil(
      caches.open('my-pwa-cache').then((cache) => {
        return cache.addAll(['/index.html', '/offline.html', '/styles.css', '/main.js']);
      })
    );
  });
  
  self.addEventListener('fetch', (event:FetchEvent) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });