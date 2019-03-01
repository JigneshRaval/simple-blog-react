// Set this to true for production
var doCache = false;
const CACHE_NAME = "cache-v4";
const assetToCache = [
    "/index.html",
    "/manifest.json",
    "/src/assets/css/style.css"
];
self.addEventListener("install", function (event) {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(assetToCache);
            })
            .catch(console.error)
    );
});

self.addEventListener('activate', function (event) {
    var cacheKeeplist = ['v3'];

    event.waitUntil(
        caches.keys().then(function (assetToCache) {
            return Promise.all(assetToCache.map(function (key) {
                if (cacheKeeplist.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener("fetch", function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});
