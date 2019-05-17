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


// https://react-hooks-cheatsheet.com/usestate
/*
const ArticleHome1 = () => {
    const [state, setState] = useState({
        age: 20,
        isConfirm: false,
        isEditMode: false,
        loading: false,
        showForm: false,
        siblingsNum: 4,
        toastChildren: []
    })

    useEffect(() => {
        setState({
            ...state,
            age: 40,
            isEditMode: false
        })
    }, []);

    const updateAge = () => {

        setState((prevState) => {
            return ({
                ...state,
                age: state.age + 5,
                isEditMode: true,
                showForm: true
            })
        });

        setState({
            ...state,
            age: state.age + 5,
            isEditMode: true,
            showForm: true
        });


        console.log('STATE: ', state);
    }

    const handleClick = val =>
        setState({
            ...state,
            [val]: state[val] + 1
        })

    const { age, siblingsNum, isEditMode, showForm } = state;


    return (
        <div>
            <p>Today I am {age} Years of Age</p>
            <p>I have {siblingsNum} siblings</p>
            <p>isEditMode : {isEditMode.toString()}</p>
            <p>showForm : {showForm.toString()}</p>

            <div>
                <button onClick={updateAge}>Update Age!</button>

                <button onClick={handleClick.bind(null, 'age')}>Get older!</button>
                <button onClick={handleClick.bind(null, 'siblingsNum')}>
                    More siblings!
          </button>
            </div>
        </div>
    )
}
*/

const ArticleHome = () => {
    // articleService: ArticleService;
    // timer: any;

    const [state, setState] = useState({
        articleService: new ArticleService(),
        articles: [],
        articleCount: 0,
        editData: {},
        currentArticle: '',
        filteredArticles: [],
        categories: categories.categories,
        isEditMode: false,
        showForm: false,
        loading: false, // will be true when ajax request is running,
        toastChildren: [],
        isConfirm: false,
        reRender: true
    });

    /* const [todos, dispatch] = useReducer(
        articleReducer,
        state.articles
    ); */

    useEffect(() => {
        if (state.reRender) {
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
                    updateArticleDataService(state.articles);
                })
                .catch((err: any) => {
                    console.log('Error in fetching all the records : ', err);
                });

            console.log('State : ', state);
        }

        // componentWillUnmount
        return () => {
            setState({
                ...state,
                reRender: false,
                toastChildren: []
            });
        }
    }, [state.reRender]);


    // Dynamically add multiple ToastMessage components.
    const addToastMessage = (messageType: string, message: string, isConfirm: boolean = false, articleId: string = '') => {

        setState({
            ...state,
            isConfirm: isConfirm
        });

        const toastChild = <ToastMessage displayToastMessage={true} toastMessageType={messageType} isConfirm={isConfirm} onConfirm={handleConfirmEvent.bind(this, articleId)}>{message}</ToastMessage>;

        const newChildren = [...state.toastChildren, toastChild];

        setState({
            ...state,
            toastChildren: newChildren
        });
    }

    const handleConfirmEvent = (articleId: string) => {
        if (articleId) {
            handleDeleteArticle(articleId);
        }
    }

    // Create new article
    // =========================================
    const handleCreateArticle = (formDataObj: any) => {
        articleService.createArticle(formDataObj).then((data: any) => {

            let articles = [data.newDoc, ...state.articles];

            setState({
                ...state,
                articles: articles,
                filteredArticles: articles,
                currentArticle: data.newDoc,
                reRender: true
            });

            // display message
            addToastMessage('success', `New Article created successfully. ${data.newDoc.title}`)

            // Update variable value in articles.service.ts
            updateArticleDataService(state.articles);
        }).catch((err) => {
            console.log('Error in creating new article', err);
        });

        setState({
            ...state,
            reRender: false
        });
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

        /* setState({
            ...state,
            showForm: true
        }); */

        state.articles.map((article: any) => {
            if (article._id === articleId) {
                setState({
                    ...state,
                    isEditMode: true,
                    editData: article
                });
            }
        });

        console.log('STATE1 : ', state);
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

            setState(state => ({
                ...state,
                articles: articles,
                filteredArticles: articles,
                editData: {},
                isEditMode: false,
                currentArticle: data.docs[0],
                reRender: true
            }));

            // display message
            addToastMessage('success', `Article updated successfully... ${data.docs[0].title}`);

            // Update variable value in articles.service.ts
            updateArticleDataService(state.articles);

            console.log('Edit update article State : ', state);
        }).catch((err: any) => {
            console.log('Error in edit or save article : ', err);
        });

        setState(state => ({
            ...state,
            reRender: false
        }));
    }


    // Delete single article by articleId
    // =========================================
    const handleDeleteArticle = (articleId: string): void => {
        articleService.deleteArticle(articleId).then((data: any) => {
            setState({
                ...state,
                articles: data.docs,
                filteredArticles: data.docs,
                reRender: true
            });

            // display message
            addToastMessage('success', `Article <b>${articleId}</b> deleted successfully.`, false);

            // Update variable value in articles.service.ts
            updateArticleDataService(state.articles);

            console.log('Delete Article State : ', state);
        }).catch((err: any) => {
            console.log('Error in deleting article : ', err);
        });

        setState(state => ({
            ...state,
            reRender: false
        }));
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
    const { articles, isEditMode, currentArticle, filteredArticles, loading } = state;

    // render() {
    return (
        <main className="wrapper uk-offcanvas-content">
            <div className="container-fluid">

                <section className="content-wrapper">
                    {/* <div style={{ 'position': 'fixed', zIndex: 1050 }}>{isEditMode.toString()}</div> */}

                    <Header articles={articles} onFilterArticles={handleFilterArticles} />

                    <section className="content-section">

                        <CreateArticleFormComponent
                            {...state}
                            onCreateArticle={handleCreateArticle}
                            onEditSaveArticle={handleEditSaveArticle}
                            firebase={firebase}
                        />

                        <ArticlesList
                            filteredArticles={filteredArticles}
                            loading={loading}
                            onAddToastMessage={addToastMessage.bind(this)}
                            onDeleteArticle={handleDeleteArticle}
                            onEditArticle={handleEditArticle}
                            onDisplaySingleArticleContent={handleDisplaySingleArticleContent}
                            onFilterArticles={handleFilterArticles}
                            markAsFavorite={handleMarkAsFavorite}
                        />


                        {
                            currentArticle ? (
                                <Article currentArticle={currentArticle} onFilterArticles={handleFilterArticles} />
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

    )
    // }
}

export default ArticleHome;
