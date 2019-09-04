// articles.service.ts

// Service for CRUD operations
// Create, Read, Update and Delete articles
export class DataService {
    articles: any;
    API_URL: string;

    constructor(serviceType: string) {
        this.API_URL = `/api/${serviceType}`;
    }

    getData() {
        return this.articles;
    }

    setData(articles: any) {
        this.articles = articles;
    }

    /**
     * getAllRecords: Get all the records from database
     */
    public async getAllRecords() {
        let response = await fetch(`${this.API_URL}`);
        this.articles = await response.json();
        navigator.serviceWorker.controller.postMessage(this.articles)  // <--- This line right here sends our data to sw.js
        return this.articles;
    }

    /* public getAllRecords() {
        // Render all Todo items on component render
        return fetch(`${this.API_URL}`)
            .then((response) => {
                // If error then exit
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                }

                // Examine the text in the response
                this.articles = response.json();
                return this.articles;
            });
    } */


    /**
     * getRecordById: Get single articles by Id
     */
    public getRecordById(recordId: string) {
        console.log('getRecordById :', recordId);

        return fetch(`${this.API_URL}/${recordId}`)
            .then((response) => {
                // If error then exit
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                }

                // Examine the text in the response
                this.articles = response.json();
                return this.articles;
            });
    }


    /**
     * createArticle: Create new article
     */
    public createRecord(formData: any) {
        console.log('createRecord :');
        // Post form data to server
        return fetch(`${this.API_URL}/add`, {
            method: 'POST',
            body: JSON.stringify(formData),
            mode: 'cors',
            // redirect: 'follow',
            headers: new Headers({
                'Content-Type': 'application/json'
                //"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            })
        })
            .then((response) => {
                // If error then exit
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                }

                // Examine the text in the response
                this.articles = response.json();
                return this.articles;
            });
    }

    public editRecord(recordId: string, formData: any) {
        console.log('editRecord :', recordId);
        return fetch(`${this.API_URL}/edit/${recordId}`, {
            method: 'POST',
            body: JSON.stringify(formData),
            mode: 'cors',
            redirect: 'follow',
            headers: new Headers({
                'Content-Type': 'application/json'
                //"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            })
        })
            .then((response) => response.json());
    }

    public deleteRecord(recordId: string) {
        console.log(`deleteRecord - ${recordId}:`);
        return fetch(`${this.API_URL}/delete/${recordId}`, {
            method: 'DELETE',
            mode: 'cors',
            redirect: 'follow',
            headers: new Headers({
                'Content-Type': 'application/json'
                //"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            })
        })
            .then((response) => response.json());
    }

    public deleteAllRecords() {
        console.log('deleteAllRecords :');
    }

    public markAsFavorite(recordId: string, isFavorite: boolean) {
        let formData = { favorite: !isFavorite };

        return fetch(`${this.API_URL}/favorite/${recordId}`, {
            method: 'PUT',
            body: JSON.stringify(formData),
            mode: 'cors',
            redirect: 'follow',
            headers: new Headers({
                'Content-Type': 'application/json'
                //"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            })
        })
            .then((response) => response.json());
    }
}
