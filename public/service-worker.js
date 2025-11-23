
const CACHE_NAME = 'site-static-v54';
const API_CACHE = 'api-cache-v54';
// const NETWORK_TIMEOUT = 3000;
const assets =[
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/manifest.json',
    '/offline.html',
    '/hero.jpg',
    'icons/logo.png',
];


self.addEventListener("install", (event) => {
    console.log("Service worker installed");
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache)=> {
            return cache.addAll(assets);
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) =>{
    console.log("service worker registered");
    event.waitUntil(
        caches.keys().then((keys)=>
        Promise.all(
            keys.filter((key) => key !=CACHE_NAME)
            .map((key) => caches.delete(key))
        ))
    );
    self.clients.claim();
});


self.addEventListener("fetch", (event) => {
    const requestUrl = new URL(event.request.url);

  // 🔹 Skip caching for Firestore (or other APIs)
  if (
    requestUrl.origin.includes("firestore.googleapis.com") || 
    requestUrl.pathname.startsWith("/__/") 
  ) {
    return;
  }
  if(requestUrl.pathname.startsWith("/_next/") || assets.includes(requestUrl.pathname)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            // Only cache valid responses
            if (
              networkResponse &&
              networkResponse.status === 200 &&
              networkResponse.type === "basic"
            ) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }

            return networkResponse;
          })
          .catch(() => cachedResponse); // fallback if offline

        // Return cached first, then update
        return cachedResponse || fetchPromise;
      })
      .catch(() => {
          return caches.match('/offline.html');
        })
    );
  }
  else {
  event.respondWith(
      fetch(event.request)
        .catch(() => {
          console.log('API request failed, serving offline fallback:', requestUrl.pathname);
          return caches.match('/offline.html');
        })
    );
    return;
}

});


self.addEventListener("message",(event)=> {
    if(event.data && event.data.type === "SKIP_WAITING"){
        self.skipWaiting();
    }
  //   if (event.data && event.data.type === 'CLEAR_SESSION') {
  //   caches.delete(API_CACHE).then(() => {
  //     console.log('Session cache cleared.');
  //   });
  // }
}); 