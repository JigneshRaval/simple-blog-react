import React from "react";
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

// SERVICES
// ==========================
import { ArticleService } from "../services/articles.service";
import Utils from '../services/utils';


// COMPONENTS
// ==========================
import Header from "../components/Header.component";
import Sidebar from '../components/Sidebar.component';
import ArticlesList from "../components/Articles-List.component";
import ToastMessage from "../components/ToastMessage";
import { Article } from "../components/Article.component";
import { CreateArticleFormComponent } from '../components/Create-Article-Form.component';

import ArticleContext from '../services/context';


// FIREBASE
// ==========================
import firebase from '../firebase';
const dbRef = firebase.database().ref('articles');
dbRef.on("value", function (snapshot) {
    console.log('Firebase snapshot ==', snapshot.val());
});

let categories = require('../assets/data/categories.json');
const utils = new Utils();

// declare var $: any;
// declare var hljs: any;
declare var UIkit: any;


class ArticleHome extends React.Component<any, any> {
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
            // displayToastMessage: false,
            // toastMessage: 'Test',
            // toastMessageType: '',
            toastChildren: [],
            isConfirm: false,
            deleteArticle: false
        };
    }

    // Dynamically add multiple ToastMessage components.
    addToastMessage(messageType: string, message: string, isConfirm: boolean = false) {
        let _this = this;
        this.setState({ isConfirm: isConfirm });
        const toastChild = <ToastMessage displayToastMessage={true} toastMessageType={messageType} isConfirm={isConfirm} onConfirm={this.handleConfirmEvent.bind(this)}>{message}</ToastMessage>;
        const newChildren = [...this.state.toastChildren, toastChild];
        this.setState({ toastChildren: newChildren });
    }

    handleConfirmEvent() {
        //this.setState({ deleteArticle: true });
        //if (this.state.deleteArticle) {
            this.handleDeleteArticle(this.state.currentArticle._id);
        //}
    }

    componentDidMount() {
        // Show loading indicator
        this.setState({ loading: true });

        // Get all Articles on component mount
        this.articleService.getAllArticles()
            .then((data) => {
                this.setState({ articles: data.docs, articleCount: data.docs.length, filteredArticles: data.docs, currentArticle: data.docs[0], loading: false });

                // Update variable value in articles.service.ts
                this.updateArticleDataService(this.state.articles);
            })
            .catch((err) => {
                console.log('Error in fetching all the records : ', err);
            });
    }


    // Create new article
    // =========================================
    handleCreateArticle = (formDataObj: any) => {
        this.articleService.createArticle(formDataObj).then((data: any) => {

            let articles = [data.newDoc, ...this.state.articles];

            this.setState({ articles, filteredArticles: articles, currentArticle: data.newDoc });

            // display message
            this.addToastMessage('success', `New Article created successfully. ${data.newDoc.title}`)

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

            // display message
            this.addToastMessage('success', `Article updated successfully... ${data.docs[0].title}`);

            // Update variable value in articles.service.ts
            this.updateArticleDataService(this.state.articles);
        }).catch((err) => {
            console.log('Error in edit or save article : ', err);
        });;
    }


    // Delete single article by articleId
    // =========================================
    handleDeleteArticle = (articleId: string): void => {
        // display message
//         this.addToastMessage('warning', `Are you sure you want to delete this article?.`, true);

        //if (this.state.deleteArticle) {
            this.articleService.deleteArticle(articleId).then((data: any) => {
                this.setState({ articles: data.docs, filteredArticles: data.docs });

                // display message
                this.addToastMessage('success', `Article <b>${articleId}</b> deleted successfully.`, false);

                // Update variable value in articles.service.ts
                this.updateArticleDataService(this.state.articles);
            }).catch((err) => {
                console.log('Error in deleting article : ', err);
            });

            this.setState({ deleteArticle: false });
        //}
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

                                {/* <ToastMessage displayToastMessage={this.state.displayToastMessage} toastMessageType={this.state.toastMessageType}>{this.state.toastMessage}</ToastMessage> */}

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
                                    onAddToastMessage={this.addToastMessage.bind(this)}
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
                        <div className="toast-message__wrapper">{this.state.toastChildren}</div>
                    </main>
                </React.Fragment>
            </Router>
        )
    }
}

export default ArticleHome;
