export class ArticleService {
    articles: any;

    constructor() { }

    public getAllArticles() {
        console.log('getAllArticles :');
        // Render all Todo items on component render
        return fetch('/api/articles')
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

    public getArticleById(articleId: string) {
        console.log('getArticleById :', articleId);
    }

    public createArticle() {
        console.log('getAllArticles :');
    }

    public editArticle() {
        console.log('getAllArticles :');
    }

    public deleteArticle(articleId: string) {
        console.log(`deleteArticle - ${articleId}:`);
        fetch(`/api/articles/delete/${articleId}`, {
            method: 'DELETE',
            mode: 'cors',
            redirect: 'follow',
            headers: new Headers({
                'Content-Type': 'application/json'
                //"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            })
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(`Article deleted successfully : `, data);
            })
            .catch((err) => {
                console.log(`Error in deleting article .`, err);
            });
    }

    public deleteAllArticles() {
        console.log('getAllArticles :');
    }
}
