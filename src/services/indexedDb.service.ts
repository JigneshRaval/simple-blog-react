
// IndexedDB
// https://blog.formpl.us/how-to-handle-post-put-requests-in-offline-applications-using-service-workers-IndexedDB-and-da7d0798a9ab
// https://medium.com/web-on-the-edge/offline-posts-with-progressive-web-apps-fc2dc4ad895
let code_candy_db: any;

export class IndexedDBService {
    public STORE_NAME = 'articles';

    constructor() {
        this.STORE_NAME = 'articles';
    }

    public openDatabase(records: any) {
        // if `code-candy-db` does not already exist in our browser (under our site), it is created
        var indexedDBOpenRequest = indexedDB.open('code-candy-db')

        indexedDBOpenRequest.onerror = (error: any) => {
            // error creating db
            console.error('IndexedDB error:', error)
        }

        indexedDBOpenRequest.onupgradeneeded = (event: any) => {
            // This should only execute if there's a need to create/update db.
            code_candy_db = event.target['result'];

            // Note : Don't use keyPath if you want to add custom key, use it in .add or .put method of indexedDb
            code_candy_db.createObjectStore(this.STORE_NAME, { keyPath: '_id' });
            // var objectStore = code_candy_db.createObjectStore(this.STORE_NAME, { keyPath: '_id' });

            // Add all the records on the store creation
            /* if (records && records.length > 0) {
                records.map((record: any, index: number) => {
                    objectStore.add(record);
                });
            } */
        }

        // This will execute each time the database is opened.
        indexedDBOpenRequest.onsuccess = (event: any) => {
            code_candy_db = event.target['result']
        }
    }


    public getObjectStore(storeName: string, mode?: any) {
        return code_candy_db.transaction(storeName, mode).objectStore(storeName)
    }

    public addSingleRecord(record: any) {
        let request = this.getObjectStore(this.STORE_NAME, 'readwrite').add(record);

        if (request.error) {
            console.log(request.error);
            // If record is already available then update it
            // var request = code_candy_db.transaction([this.STORE_NAME], "readwrite")
            // .objectStore(this.STORE_NAME)
            // .put(records);
        }

        request.onsuccess = (event: any) => {
            console.log("Kenny has been added to your database.", event);
        };

        request.onerror = (event: any) => {
            console.log("Unable to add data\r\nKenny is aready exist in your database! ", event);
        }
    }

    public addAllRecord(records: any) {
        let objStore = code_candy_db.transaction(this.STORE_NAME, 'readwrite').objectStore(this.STORE_NAME);
        if (records && records.length > 0) {
            records.map((record: any, index: number) => {
                objStore.add(record);
            });
        }
    }

    public getSingleRecord(key: any, callback: any) {
        var transaction = code_candy_db.transaction([this.STORE_NAME]);
        var objectStore = transaction.objectStore(this.STORE_NAME);
        var request = objectStore.get(key);

        request.onerror = (event: any) => {
            console.log("Unable to retrieve daa from database!");
        };

        request.onsuccess = (event: any) => {
            // Do something with the request.result!
            if (request.result) {
                console.log('getSingleRecord() : ', request.result);
                callback(request.result);
            } else {
                console.log("Kenny couldn't be found in your database!");
            }
        };
    }

    public idbGetAllRecords() {
        var objectStore = code_candy_db.transaction(this.STORE_NAME, 'readonly').objectStore(this.STORE_NAME);
        return objectStore.getAll();
    }

    public savePostRequests(url: string, payload: any) {
        var request = this.getObjectStore(this.STORE_NAME, 'readwrite').add({
            url: url,
            payload: payload,
            method: 'POST'
        })
        request.onsuccess = function (event: any) {
            console.log('a new POST request has been added to IndexedDB')
        }

        request.onerror = function (error: any) {
            console.error(error)
        }
    }

    public sendPostToServer() {
        var savedRequests: any = []
        var req = this.getObjectStore(this.STORE_NAME, 'readwrite').openCursor() // FOLDERNAME = 'post_requests'

        req.onsuccess = function (event: any) {
            var cursor = event.target.result

            if (cursor) {
                // Keep moving the cursor forward and collecting saved requests.
                savedRequests.push(cursor.value)
                cursor.continue()
            } else {
                // At this point, we have collected all the post requests in IndexedDB.
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
                            this.getObjectStore(this.STORE_NAME, 'readwrite').delete(savedRequest.id)
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

}

