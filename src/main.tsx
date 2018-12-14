// ./src/main.tsx

// REACT
import * as React from "react";
import * as ReactDOM from "react-dom";

// CSS
import './assets/styles/main.scss';

// VENDOR
import './vendor.ts';

// FIREBASE
import firebase from './firebase';
const dbRef = firebase.database().ref('articles');
dbRef.on("value", function (snapshot) {
    console.log('Firebase snapshot ==', snapshot.val());
});
// SERVICES
import { ArticleService } from "./services/articles.service";
import Utils from './services/utils';
const utils = new Utils();

// COMPONENTS
import Header from "./components/Header.component";
import Sidebar from './components/Sidebar.component';
import ArticlesList from "./components/Articles-List.component";
import { Article } from "./components/Article.component";
import { CreateArticleFormComponent } from './components/Create-Article-Form.component';
/*
import HOC from './components/HOC-examples/HOC.component';
import UserName from './components/HOC-examples/username.component';

const HOCDemo = HOC(UserName);
*/
let categories = require('./assets/data/categories.json');

declare var $: any;
declare var hljs: any;
declare var UIkit: any;

export class App extends React.Component<any, any> {
    articleService: ArticleService;
    timer: any;

    constructor(props: any) {
        super(props);
        this.articleService = new ArticleService();

        this.state = {
            articles: [],
            filteredArticles: [],
            categories: categories.categories,
            isEditMode: false,
            articleCount: 0,
            editData: {},
            currentArticle: '',
            showForm: false,
            articleService: this.articleService
        };
    }

    componentDidMount() {
        // Render all Articles on component mount
        this.articleService.getAllArticles()
            .then((data) => {
                console.log('Data : ', data);
                this.setState({ articles: data.docs, articleCount: data.docs.length, filteredArticles: data.docs, currentArticle: data.docs[0] });

                // Update variable value in articles.service.ts
                this.updateArticleDataService(this.state.articles);
            })
            .catch((err) => {
                console.log('Error in fetching all reacords', err);
            });
    }


    // Create new article
    // =========================================
    handleCreateArticle = (formDataObj: any) => {
        this.articleService.createArticle(formDataObj).then((data: any) => {

            let articles = [data.newDoc, ...this.state.articles];

            this.setState({ articles, filteredArticles: articles, currentArticle: data.newDoc });

            // Update variable value in articles.service.ts
            this.updateArticleDataService(this.state.articles);
        });
    }


    // Display Single Article Content
    // =========================================
    handleDisplaySingleArticleContent = (articleId: string) => {
        this.state.articles.map((article: any, index: number) => {
            if (article._id === articleId) {
                this.setState({ currentArticle: article });
            }
        });

        // Highlight code blocks
        console.log(window);
        $('pre code').each(function (i: any, block: any) {
            hljs.highlightBlock(block);
        });
    }


    // Get Article data on click of Edit button
    // =========================================
    handleEditArticle = (articleId: string, isFormVisible: boolean) => {
        UIkit.modal('#modal-example').show();
        this.setState({ isEditMode: true, showForm: isFormVisible });
        this.state.articles.map((article: any) => {
            if (article._id === articleId) {
                this.setState({ editData: article });
            }
        });
    }


    // Update data on the server
    // =========================================
    handleEditSaveArticle = (articleId: string, formDataObj: any) => {
        let articles = [...this.state.articles];

        this.articleService.editArticle(articleId, formDataObj).then((data: any) => {
            articles.map((article, index) => {
                if (article._id === data.docs[0]._id) {
                    articles[index] = { ...data.docs[0] };
                    articles[index] = data.docs[0];
                }
            });

            this.setState({ articles: articles, filteredArticles: articles, editData: {}, isEditMode: false, currentArticle: data.docs[0] });

            // Update variable value in articles.service.ts
            this.updateArticleDataService(this.state.articles);
        });
    }


    // Delete single article by articleId
    // =========================================
    handleDeleteArticle = (articleId: string): void => {
        this.articleService.deleteArticle(articleId).then((data: any) => {
            this.setState({ articles: data.docs, filteredArticles: data.docs });

            // Update variable value in articles.service.ts
            this.updateArticleDataService(this.state.articles);
        });
    }


    // Filter all the articles by Tag, Category or the search value provided by the user
    // =========================================
    handleFilterArticles = (event: any, filterBy: string) => {
        let filteredList: any = [];
        let searchBarElem = document.querySelector('.uk-search-default');
        let searchBox = document.querySelector('.uk-search-input');
        let searchTerm = event.target.value || event.target.getAttribute('data-tag-name');
        event.target.parentElement.classList.add('active');
        searchBox.value = searchTerm;
        // throttle search event
        /* if (this.timer) {
            clearTimeout(this.timer);
        } */

        // this.timer = setTimeout(() => {
        console.log('handleFilterArticles Fired Timeout');

        if (searchTerm) {
            searchBarElem.classList.add('isSearching');

            filteredList = utils.filterArticlesBy(searchTerm, filterBy, this.state.articles);

            // If "searchTerm" provided then, Set filtered articles in the state
            this.setState({ filteredArticles: filteredList });
        } else {
            // Hide clear search icon
            searchBarElem.classList.remove('isSearching');

            // If "searchTerm" NOT provided then, Set default articles list into the filtered articles in the state
            this.setState({ filteredArticles: this.state.articles });
        }

        //}, 500);

    }


    // Update variable value in articles.service.ts
    // =========================================
    updateArticleDataService = (data: any) => {
        this.articleService.setArticlesData(data);
    }

    handleToggleFormDisplay = (isFormVisible: boolean) => {
        this.setState({ showForm: isFormVisible });
    }

    handleMarkAsFavorite = (articleId: string, isFavorite: boolean) => {
        this.articleService.markAsFavorite(articleId, isFavorite).then(data => {
            let articles = [...this.state.articles];
            articles.map((article: any, index: number) => {
                if (article._id === data.docs[0]._id) {
                    articles[index] = { ...data.docs[0] };
                    articles[index] = data.docs[0];
                }
            });

            this.setState({ filteredArticles: articles });
        });
    }

    render() {
        return (
            <React.Fragment>
                <main className="wrapper uk-offcanvas-content">
                    <div className="container-fluid">

                        {/* <aside className="sidebar-panel">

                            <Sidebar onFilterArticles={this.handleFilterArticles} onShowAddEditForm={this.handleToggleFormDisplay} {...this.state} />

                        </aside> */}

                        <section className="content-wrapper">

                            <Header onFilterArticles={this.handleFilterArticles} articles={this.state.articles} />

                            <section className="content-section">
                                {/* If "showform"=true then display Create form else show list items */}
                                <CreateArticleFormComponent
                                    {...this.state}
                                    onCreateArticle={this.handleCreateArticle}
                                    onEditSaveArticle={this.handleEditSaveArticle}
                                    onToggleAddEditForm={this.handleToggleFormDisplay}
                                    firebase={firebase}
                                />

                                <ArticlesList {...this.state}
                                    onDeleteArticle={this.handleDeleteArticle}
                                    onEditArticle={this.handleEditArticle}
                                    onDisplaySingleArticleContent={this.handleDisplaySingleArticleContent}
                                    onFilterArticles={this.handleFilterArticles}
                                    markAsFavorite={this.handleMarkAsFavorite}
                                />

                                {
                                    this.state.currentArticle ? (
                                        <Article currentArticle={this.state.currentArticle} onFilterArticles={this.handleFilterArticles} />
                                    ) : ''
                                }

                            </section>
                        </section>
                    </div>

                    <div id="offcanvas-usage" uk-offcanvas="flip: true; overlay: true">
                        <div className="uk-offcanvas-bar">
                            <button className="uk-offcanvas-close" type="button" uk-close=""></button>

                            <Sidebar onFilterArticles={this.handleFilterArticles} onShowAddEditForm={this.handleToggleFormDisplay} {...this.state} />
                        </div>
                    </div>

                </main>
            </React.Fragment>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById("app")
);
