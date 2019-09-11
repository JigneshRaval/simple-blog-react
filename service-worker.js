// Set this to true for production
var doCache = false;
const CACHE_NAME = "cache-v4";

const assetToCache = [
    "/",
    "articles/",
    "index.html",
    "manifest.json",
    "assets/css/style.css",
    "addTohome.js",
    "serviceWorkerInit.js",
    "app.bundle.js",
    "app.bundle.js.map",
    "vendors~app.bundle.js",
    "vendors~app.bundle.js.map",
    "assets/css/app.bundle.css",
    "assets/css/app.bundle.css.map",
    "assets/css/tomorrow-night-bright.css",
    "assets/js/jquery-3.3.1.min.js",
    "assets/js/summernote-lite.js",
    "assets/js/highlight.pack.js"
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
    var cacheKeeplist = ['v5'];

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

/* self.addEventListener("fetch", function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
}); */

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.open('cache-v4').then(function (cache) {
            return cache.match(event.request).then(function (response) {
                return response || fetch(event.request).then(function (response) {
                    cache.put(event.request, response.clone());
                    return response;
                }).catch((error) => {
                    console.log('Error in service worker fetch event : ', error);
                });
            });
        })
    );
});

// https://github.com/AdeyinkaAdegbenro/Offline_Flask_Form/blob/master/static/sw.js
/* self.addEventListener('fetch', function (event) {
    // every request from our site, passes through the fetch handler
    // I have proof
    console.log('I am a request with url: ', event.request.clone().url)
    if (event.request.method === 'GET') {
        event.respondWith(
            // check all the caches in the browser and find
            // out whether our request is in any of them
            caches.match(event.request)
                .then(function (response) {
                    if (response) {
                        // if we are here, that means there's a match
                        //return the response stored in browser
                        return response;
                    }
                    // no match in cache, use the network instead
                    return fetch(event.request);
                }
                )
        );
    } else if (event.request.clone().method === 'POST') {
        // attempt to send request normally
        console.log('form_data', form_data)
        event.respondWith(fetch(event.request.clone()).catch(function (error) {
            // only save post requests in browser, if an error occurs
            // savePostRequests(event.request.clone().url, form_data)
        }))
    }
}); */

self.addEventListener('message', function (event) {
    console.log('form data', event.data)
    if (event.data.hasOwnProperty('data')) {
        // receives form data from script.js upon submission
        form_data = event.data.data
    }
});

self.addEventListener('sync', function (event) {
    console.log('now online. Sync data');
    try {
        fetch(`/api/articles`).then((response => response.json())).catch((error)> console.log('Error in fetching articles from service worker.', error));
    } catch (error) {
        console.log('Looks like there was a problem. Status Code: ', error)
    }

    if (event.tag === 'sendFormData') { // event.tag name checked here must be the same as the one used while registering sync
        event.waitUntil(
            // Send our POST request to the server, now that the user is online
            // sendPostToServer()
        )
    }
});
