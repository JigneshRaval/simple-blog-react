import React, { useReducer, useEffect, useState } from "react";
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
import articleReducer from '../services/Reducer';

// FIREBASE
// ==========================
import firebase from '../firebase';
const dbRef = firebase.database().ref('articles');
dbRef.on("value", function (snapshot) {
    console.log('Firebase snapshot ==', snapshot.val());
});

let categories = require('../assets/data/categories.json');
const utils = new Utils();
const articleService = new ArticleService();
// declare var $: any;
// declare var hljs: any;
declare var UIkit: any;
/*
const initialState = {
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
    toastChildren: [],
    isConfirm: false
} */

const ArticleHome = () => {
    // articleService: ArticleService;
    // timer: any;


    const [state, setState] = useState({
        articles: [],
        filteredArticles: [],
        categories: categories.categories,
        isEditMode: false,
        articleCount: 0,
        editData: {},
        currentArticle: '',
        showForm: false,
        articleService: articleService,
        loading: false, // will be true when ajax request is running,
        toastChildren: [],
        isConfirm: false
    });

    const [todos, dispatch] = useReducer(
        articleReducer,
        state.articles
    );

    console.log('Todos :', todos);
    /* constructor(props: any) {
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
            toastChildren: [],
            isConfirm: false
        };
    } */


    useEffect(() => {
        // Show loading indicator
        setState({
            ...state,
            loading: true
        });

        // Get all Articles on component mount
        articleService.getAllArticles()
            .then((data: any) => {
                setState({
                    ...state,
                    articles: data.docs,
                    articleCount: data.docs.length,
                    filteredArticles: data.docs,
                    currentArticle: data.docs[0],
                    loading: false
                });

                // Update variable value in articles.service.ts
                this.updateArticleDataService(state.articles);
            })
            .catch((err: any) => {
                console.log('Error in fetching all the records : ', err);
            });

        console.log('State : ', state);
    }, []);


    // Dynamically add multiple ToastMessage components.
    const addToastMessage = (messageType: string, message: string, isConfirm: boolean = false) => {
        let _this = this;
        setState({
            ...state,
            isConfirm: isConfirm
        });
        const toastChild = <ToastMessage displayToastMessage={true} toastMessageType={messageType} isConfirm={isConfirm} onConfirm={this.handleConfirmEvent.bind(this)}>{message}</ToastMessage>;
        const newChildren = [...state.toastChildren, toastChild];
        setState({
            ...state,
            toastChildren: newChildren
        });
    }

    const handleConfirmEvent = () => {
        this.handleDeleteArticle(state.currentArticle._id);
    }

    // Create new article
    // =========================================
    const handleCreateArticle = (formDataObj: any) => {
        articleService.createArticle(formDataObj).then((data: any) => {

            let articles = [data.newDoc, ...state.articles];

            setState({
                ...state,
                articles, filteredArticles: articles, currentArticle: data.newDoc
            });

            // display message
            this.addToastMessage('success', `New Article created successfully. ${data.newDoc.title}`)

            // Update variable value in articles.service.ts
            this.updateArticleDataService(state.articles);
        }).catch((err) => {
            console.log('Error in creating new article', err);
        });;
    }


    // Display Single Article Content
    // =========================================
    const handleDisplaySingleArticleContent = (articleId: string) => {
        state.articles.map((article: any, index: number) => {
            if (article._id === articleId) {
                setState({
                    ...state,
                    currentArticle: article
                });
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
    const handleEditArticle = (articleId: string, isFormVisible: boolean) => {
        UIkit.modal('#modal-example').show();

        setState({
            ...state,
            isEditMode: true,
            showForm: isFormVisible
        });

        state.articles.map((article: any) => {
            if (article._id === articleId) {
                setState({
                    ...state,
                    editData: article
                });
            }
        });
    }

    const updateState = () => {

    }

    // Update data on the server
    // =========================================
    const handleEditSaveArticle = (articleId: string, formDataObj: any) => {
        let articles = [...state.articles];

        articleService.editArticle(articleId, formDataObj).then((data: any) => {
            articles.map((article, index) => {
                if (article._id === data.docs[0]._id) {
                    articles[index] = { ...data.docs[0] };
                    articles[index] = data.docs[0];
                }
            });

            setState({
                ...state,
                articles: articles,
                filteredArticles: articles,
                editData: {},
                isEditMode: false,
                currentArticle: data.docs[0]
            });

            // display message
            this.addToastMessage('success', `Article updated successfully... ${data.docs[0].title}`);

            // Update variable value in articles.service.ts
            this.updateArticleDataService(state.articles);
        }).catch((err: any) => {
            console.log('Error in edit or save article : ', err);
        });;
    }


    // Delete single article by articleId
    // =========================================
    const handleDeleteArticle = (articleId: string): void => {
        articleService.deleteArticle(articleId).then((data: any) => {
            setState({
                ...state,
                articles: data.docs,
                filteredArticles: data.docs
            });

            // display message
            this.addToastMessage('success', `Article <b>${articleId}</b> deleted successfully.`, false);

            // Update variable value in articles.service.ts
            this.updateArticleDataService(state.articles);
        }).catch((err: any) => {
            console.log('Error in deleting article : ', err);
        });

        // this.setState({ deleteArticle: false });
    }


    // Update variable value in articles.service.ts
    // =========================================
    const updateArticleDataService = (data: any) => {
        articleService.setArticlesData(data);
    }

    const handleMarkAsFavorite = (articleId: string, isFavorite: boolean) => {
        articleService.markAsFavorite(articleId, isFavorite).then((data: any) => {
            let articles = [...state.articles];
            articles.map((article: any, index: number) => {
                if (article._id === data.docs[0]._id) {
                    articles[index] = { ...data.docs[0] };
                    articles[index] = data.docs[0];
                }
            });
            console.log('Mark fav :', articles);
            setState({
                ...state,
                filteredArticles: articles
            });
        });
    }


    // Filter all the articles by Tag, Category or the search value provided by the user
    // =========================================
    const handleFilterArticles = (event: any, filterBy: string) => {
        setState({
            ...state,
            filteredArticles: utils.filterArticles(event, filterBy, state.articles)
        });
    }


    // render() {
    return (
        <Router>
            <React.Fragment>
                <main className="wrapper uk-offcanvas-content">
                    <div className="container-fluid">

                        <section className="content-wrapper">
                            {/* Redirect to first article on initalizing app */}
                            {/*
                                {
                                    state.filteredArticles && state.filteredArticles.length > 0 ? <Redirect to={'/articles/' + state.filteredArticles[0]._id} /> : ''
                                }
                            */}

                            {/* <ToastMessage displayToastMessage={state.displayToastMessage} toastMessageType={state.toastMessageType}>{state.toastMessage}</ToastMessage> */}

                            {/* Example of using Context */}
                            <ArticleContext.Provider value={
                                {
                                    state: state.articles,
                                    actions: {
                                        onFilterArticles: handleFilterArticles
                                    }
                                }
                            }>

                                <Header />
                            </ArticleContext.Provider>

                            <section className="content-section">

                                {/* If "showform"=true then display Create form else show list items */}
                                <CreateArticleFormComponent
                                    {...state}
                                    onCreateArticle={handleCreateArticle}
                                    onEditSaveArticle={handleEditSaveArticle}
                                    firebase={firebase}
                                />

                                <ArticlesList {...state}
                                    onAddToastMessage={addToastMessage.bind(this)}
                                    onDeleteArticle={handleDeleteArticle}
                                    onEditArticle={handleEditArticle}
                                    onDisplaySingleArticleContent={handleDisplaySingleArticleContent}
                                    onFilterArticles={handleFilterArticles}
                                    markAsFavorite={handleMarkAsFavorite}
                                />

                                {/*
                                    Changed display single article using Router to get help of browser back button usage,
                                    to navigate through previously visited articles.
                                     */}
                                {/*
                                    <Route
                                        path="/articles/:id"
                                        render={(props: any) => <Article currentArticle={state.currentArticle} onFilterArticles={this.handleFilterArticles} articles={state.articles} {...props} />}
                                    />
                                    */}

                                {
                                    state.currentArticle ? (

                                        <Article currentArticle={state.currentArticle} onFilterArticles={handleFilterArticles} />
                                    ) : <p>No Article found</p>
                                }


                            </section>

                        </section>
                    </div>

                    <div id="offcanvas-usage" uk-offcanvas="flip: true; overlay: true">
                        <div className="uk-offcanvas-bar">
                            <button className="uk-offcanvas-close" type="button" uk-close=""></button>

                            <Sidebar onFilterArticles={handleFilterArticles} {...state} />
                        </div>
                    </div>
                    <div className="toast-message__wrapper">{state.toastChildren}</div>
                </main>
            </React.Fragment>
        </Router>
    )
    // }
}

export default ArticleHome;
