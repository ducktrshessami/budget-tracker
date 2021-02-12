const FILES = [];

const STATIC_CACHE = "";
const DATA_CACHE = "";

self.addEventListener("install", function (event) {
    event.waitUntil(caches.open(DATA_CACHE).then((cache) => cache.add("/api/transaction")));
    event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(FILES)));
    self.skipWaiting();
});

self.addEventListener("activate", function (event) {
    evt.waitUntil(caches.keys()
        .then(keyList => Promise.all(keyList.map(key => {
            if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                return caches.delete(key);
            }
        })))
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
            ));
    }
    else {
        event.respondWith(caches.open(STATIC_CACHE)
            .then(cache => cache.match(event.request))
            .then(response => response || fetch(event.request))
        );
    }
});
