const FILES = [
    "/",
    "/index.html",
    "/assets/css/styles.css",
    "/assets/js/index.js",
    "/assets/icons/icon-192x192.png",
    "/assets/icons/icon-512x512.png"
];

const STATIC_CACHE = "static-cache";
const DATA_CACHE = "data-cache";

self.addEventListener("install", function (event) {
    event.waitUntil(caches.open(DATA_CACHE)
        .then((cache) => cache.add("/api/transaction"))
        .catch(console.error)
    );
    event.waitUntil(caches.open(STATIC_CACHE)
        .then((cache) => cache.addAll(FILES))
        .catch(console.error)
    );
    self.skipWaiting();
});

self.addEventListener("activate", function (event) {
    evt.waitUntil(caches.keys()
        .then(keyList => Promise.all(keyList.map(key => {
            if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                return caches.delete(key);
            }
        })))
        .catch(console.error)
    );
    self.clients.claim();
});

self.addEventListener("fetch", function (event) {
    if (event.request.url.includes("/api/")) {
        event.respondWith(caches.open(DATA_CACHE)
            .then(cache => fetch()
                .then(response => {
                    if (response.status == 200) {
                        cache.put(event.request.url, response.clone());
                    }
                    return response;
                })
                .catch(() => cache.match(event.request))
            )
            .catch(console.error)
        );
    }
    else {
        event.respondWith(caches.open(STATIC_CACHE)
            .then(cache => cache.match(event.request))
            .then(response => response || fetch(event.request))
            .catch(console.error)
        );
    }
});
