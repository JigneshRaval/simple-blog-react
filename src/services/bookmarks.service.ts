// bookmarks.service.ts

// Service for CRUD operations
// Create, Read, Update and Delete bookmarks
export class BookmarkService {
    bookmarks: any;

    constructor() { }

    getBookmarksData() {
        return this.bookmarks;
    }

    setBookmarksData(bookmarks: any) {
        this.bookmarks = bookmarks;
    }

    /**
     * getAllBookmarks: Get all the bookmarks from database
     */
    public getAllBookmarks() {
        // Render all Todo items on component render
        return fetch('/api/bookmarks')
            .then((response) => {
                // If error then exit
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                }

                // Examine the text in the response
                this.bookmarks = response.json();
                return this.bookmarks;
            });
    }


    /**
     * getBookmarkById: Get single bookmarks by Id
     */
    public getBookmarkById(articleId: string) {
        console.log('getBookmarkById :', articleId);

        return fetch(`/api/bookmarks/${articleId}`)
            .then((response) => {
                // If error then exit
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                }

                // Examine the text in the response
                this.bookmarks = response.json();
                return this.bookmarks;
            });
    }


    /**
     * createBookmark: Create new article
     */
    public createBookmark(formData: any) {
        console.log('getAllBookmarks :');
        // Post form data to server
        return fetch('/api/bookmarks/add', {
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
                this.bookmarks = response.json();
                return this.bookmarks;
            });
    }

    public editBookmark(articleId: string, formData: any) {
        console.log('editBookmark :', articleId);
        return fetch(`/api/bookmarks/edit/${articleId}`, {
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

    public deleteBookmark(articleId: string) {
        console.log(`deleteBookmark - ${articleId}:`);
        return fetch(`/api/bookmarks/delete/${articleId}`, {
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

    public deleteAllBookmarks() {
        console.log('deleteAllBookmarks :');
    }

    public markAsFavorite(articleId: string, isFavorite: boolean) {
        let formData = { favorite: !isFavorite };

        return fetch(`/api/bookmarks/favorite/${articleId}`, {
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
