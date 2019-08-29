// Set this to true for production
var doCache = false;
const CACHE_NAME = "cache-v4";
const STORE_NAME = 'articles';
let code_candy_db;

const assetToCache = [
    "/index.html",
    "/manifest.json",
    "/assets/css/style.css"
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

self.addEventListener('message', function (event) {
    console.log('form data', event.data)
    if (event.data.hasOwnProperty('form_data')) {
        // receives form data from script.js upon submission
        form_data = event.data.form_data
    }
});

self.addEventListener('sync', function (event) {
    console.log('now online')
    if (event.tag === 'sendFormData') { // event.tag name checked here must be the same as the one used while registering sync
        event.waitUntil(
            // Send our POST request to the server, now that the user is online
            sendPostToServer()
        )
    }
});

// IndexedDB
// https://blog.formpl.us/how-to-handle-post-put-requests-in-offline-applications-using-service-workers-indexedb-and-da7d0798a9ab
// https://medium.com/web-on-the-edge/offline-posts-with-progressive-web-apps-fc2dc4ad895
function openDatabase() {
    // if `flask-form` does not already exist in our browser (under our site), it is created
    var indexedDBOpenRequest = indexedDB.open('code-candy-db')

    indexedDBOpenRequest.onerror = function (error) {
        // errpr creatimg db
        console.error('IndexedDB error:', error)
    }


    indexedDBOpenRequest.onupgradeneeded = function () {
        // This should only execute if there's a need to create/update db.
        this.result.createObjectStore(STORE_NAME, { autoIncrement: true, keyPath: 'id' })
    }

    // This will execute each time the database is opened.
    indexedDBOpenRequest.onsuccess = function () {
        code_candy_db = this.result
    }
}


function getObjectStore(storeName, mode) {
    return code_candy_db.transaction(storeName, mode).objectStore(storeName)
}

function savePostRequests(url, payload) {
    var request = getObjectStore(STORE_NAME, 'readwrite').add({
        url: url,
        payload: payload,
        method: 'POST'
    })
    request.onsuccess = function (event) {
        console.log('a new pos_ request has been added to indexedb')
    }

    request.onerror = function (error) {
        console.error(error)
    }
}

function sendPostToServer() {
    var savedRequests = []
    var req = getObjectStore(STORE_NAME).openCursor() // FOLDERNAME = 'post_requests'

    req.onsuccess = async function (event) {
        var cursor = event.target.result

        if (cursor) {
            // Keep moving the cursor forward and collecting saved requests.
            savedRequests.push(cursor.value)
            cursor.continue()
        } else {
            // At this point, we have collected all the post requests in indexedb.
            for (let savedRequest of savedRequests) {
                // send them to the server one after the other
                console.log('saved request', savedRequest)
                var requestUrl = savedRequest.url
                var payload = JSON.stringify(savedRequest.payload)
                var method = savedRequest.method
                var headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                } // if you have any other headers put them here

                fetch(requestUrl, {
                    headers: headers,
                    method: method,
                    body: payload
                }).then(function (response) {
                    console.log('server response', response)
                    if (response.status < 400) {
                        // If sending the POST request was successful, then remove it from the IndexedDB.
                        getObjectStore(STORE_NAME, 'readwrite').delete(savedRequest.id)
                    }
                }).catch(function (error) {
                    // This will be triggered if the network is still down. The request will be replayed again
                    // the next time the service worker starts up.
                    console.error('Send to Server failed:', error)
                    // since we are in a catch, it is important an error is thrown,
                    // so the background sync knows to keep retrying sendto server
                    throw error
                });
            }
        }
    }
}

openDatabase();
