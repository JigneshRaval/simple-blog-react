// ./src/main.tsx

// REACT
import React from "react";
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
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
import ToastMessage from "./components/ToastMessage";
import { Article } from "./components/Article.component";
import { CreateArticleFormComponent } from './components/Create-Article-Form.component';
/*
import HOC from './components/HOC-examples/HOC.component';
import UserName from './components/HOC-examples/username.component';

const HOCDemo = HOC(UserName);
*/

import ArticleContext from './services/context';


let categories = require('./assets/data/categories.json');

// declare var $: any;
// declare var hljs: any;
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
            articleService: this.articleService,
            loading: false, // will be true when ajax request is running,
            displayToastMessage: false
        };
    }

    componentDidMount() {
        this.setState({ loading: true, displayToastMessage: true });
        // Render all Articles on component mount
        this.articleService.getAllArticles()
            .then((data) => {
                console.log('Data : ', data);
                this.setState({ articles: data.docs, articleCount: data.docs.length, filteredArticles: data.docs, currentArticle: data.docs[0], loading: false, displayToastMessage: false });

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
        }).catch((err) => {
            console.log('Error in creating new article', err);
        });;
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
        /* console.log(window);
        $('pre code').each(function (i: any, block: any) {
            hljs.highlightBlock(block);
        }); */
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
        }).catch((err) => {
            console.log('Error in edit or save article : ', err);
        });;
    }


    // Delete single article by articleId
    // =========================================
    handleDeleteArticle = (articleId: string): void => {
        this.articleService.deleteArticle(articleId).then((data: any) => {
            this.setState({ articles: data.docs, filteredArticles: data.docs });

            // Update variable value in articles.service.ts
            this.updateArticleDataService(this.state.articles);
        }).catch((err) => {
            console.log('Error in deleting article : ', err);
        });;
    }


    // Update variable value in articles.service.ts
    // =========================================
    updateArticleDataService = (data: any) => {
        this.articleService.setArticlesData(data);
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
            console.log('Mark fav :', articles);
            this.setState({ filteredArticles: articles });
        });
    }

    // Filter all the articles by Tag, Category or the search value provided by the user
    // =========================================
    handleFilterArticles = (event: any, filterBy: string) => {
        this.setState({ filteredArticles: utils.filterArticles(event, filterBy, this.state.articles) });
        /* let searchTerm = event.target.value || event.target.getAttribute('data-tag-name');
        if (searchTerm) {
            if (event && event.keyCode) {
                if (event.keyCode === 13) {
                    this.setState({ filteredArticles: utils.filterArticles(event, filterBy, this.state.articles) });
                }
            }
        } else {
            this.setState({ filteredArticles: utils.filterArticles(event, filterBy, this.state.articles) });
        } */
    }




    render() {
        return (
            <Router>
                <React.Fragment>
                    <main className="wrapper uk-offcanvas-content">
                        <div className="container-fluid">

                            <section className="content-wrapper">
                                {/* Redirect to first article on initalizing app */}
                                {/*
                                {
                                    this.state.filteredArticles && this.state.filteredArticles.length > 0 ? <Redirect to={'/articles/' + this.state.filteredArticles[0]._id} /> : ''
                                }
                            */}
                                <ToastMessage displayToastMessage={this.state.displayToastMessage}>ToastMessage</ToastMessage>
                                {this.state.displayToastMessage ? <ToastMessage displayToastMessage={this.state.displayToastMessage}>ToastMessage</ToastMessage> : null}
                                {/* Example of using Context */}
                                <ArticleContext.Provider value={
                                    {
                                        state: this.state.articles,
                                        actions: {
                                            onFilterArticles: this.handleFilterArticles
                                        }
                                    }
                                }>
                                    <Header />
                                </ArticleContext.Provider>

                                <section className="content-section">

                                    {/* If "showform"=true then display Create form else show list items */}
                                    <CreateArticleFormComponent
                                        {...this.state}
                                        onCreateArticle={this.handleCreateArticle}
                                        onEditSaveArticle={this.handleEditSaveArticle}
                                        firebase={firebase}
                                    />

                                    <ArticlesList {...this.state}
                                        onDeleteArticle={this.handleDeleteArticle}
                                        onEditArticle={this.handleEditArticle}
                                        onDisplaySingleArticleContent={this.handleDisplaySingleArticleContent}
                                        onFilterArticles={this.handleFilterArticles}
                                        markAsFavorite={this.handleMarkAsFavorite}
                                    />

                                    {/*
                                    Changed display single article using Router to get help of browser back button usage,
                                    to navigate through previously visited articles.
                                     */}
                                    {/*
                                    <Route
                                        path="/articles/:id"
                                        render={(props: any) => <Article currentArticle={this.state.currentArticle} onFilterArticles={this.handleFilterArticles} articles={this.state.articles} {...props} />}
                                    />
                                    */}

                                    {
                                        this.state.currentArticle ? (
                                            <Article currentArticle={this.state.currentArticle} onFilterArticles={this.handleFilterArticles} />
                                        ) : <p>No Article found</p>
                                    }


                                </section>

                            </section>
                        </div>

                        <div id="offcanvas-usage" uk-offcanvas="flip: true; overlay: true">
                            <div className="uk-offcanvas-bar">
                                <button className="uk-offcanvas-close" type="button" uk-close=""></button>

                                <Sidebar onFilterArticles={this.handleFilterArticles} {...this.state} />
                            </div>
                        </div>

                    </main>
                </React.Fragment>
            </Router>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById("app")
);
