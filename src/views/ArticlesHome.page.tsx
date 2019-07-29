import React, { useReducer, useEffect, useState } from "react";
// import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

// SERVICES
// ==========================
import { DataService } from "../services/data.service";
import Utils from '../services/utils';


// COMPONENTS
// ==========================
import Header from "../components/articles/Header.component";
import Sidebar from '../components/articles/Sidebar.component';
import ArticlesList from "../components/articles/Articles-List.component";
import ToastMessage from "../components/articles/ToastMessage";
import { Article } from "../components/articles/Article.component";
import { CreateArticleFormComponent } from '../components/articles/Create-Article-Form.component';

import ArticleContext from '../services/context';
import articleReducer from '../services/Reducer';

// FIREBASE
// ==========================
import firebase from '../firebase';
const dbRef = firebase.database().ref('articles');
dbRef.on("value", function (snapshot) {
    console.log('Firebase snapshot ==', snapshot.val());
});

declare var require: any;
let categories = require('../assets/data/categories.json');
const utils = new Utils();
const dataService = new DataService('articles');

declare var UIkit: any;

const ArticleHome = (props: any) => {

    console.log('Article Home props :', props);
    const [state, setState] = useState({
        dataService: new DataService('articles'),
        articles: [],
        totalRecords: 0,
        editData: {},
        currentRecord: '',
        filteredRecords: [],
        categories: categories.categories,
        isEditMode: false,
        showForm: false,
        loading: false, // will be true when ajax request is running,
        toastChildren: [],
        isConfirm: false,
        reRender: true,
        tags: {}
    });

    const [newState, dispatch] = useReducer(articleReducer, state);

    useEffect(() => {
        if (state.reRender) {
            // Show loading indicator
            setState({
                ...state,
                loading: true
            });

            document.getElementsByTagName('body')[0].classList.add('isArticleListPanelOpened');

            // Get all Articles on component mount
            dataService.getAllRecords()
                .then((data: any) => {
                    setState({
                        ...state,
                        loading: false
                    });
                    dispatch({ type: 'GET_ALL_RECORDS', data: data.docs })

                    return data.docs;
                })
                .then((data: any) => {
                    // Update variable value in articles.service.ts
                    updateArticleDataService(data);

                    setState({
                        ...state,
                        tags: getUniqueTags(data)
                    });
                    // console.log('window :', window);

                    // Get list of all the events attached to dom, run this in browser console
                    /* Array.from(document.querySelectorAll('*')).reduce(function (pre, dom) {
                        var evtObj = getEventListeners(dom);
                        Object.keys(evtObj).forEach(function (evt) {
                            if (typeof pre[evt] === 'undefined') {
                                pre[evt] = 0
                            }
                            pre[evt] += evtObj[evt].length
                        })
                        return pre
                    }, {}); */

                })
                .catch((err: any) => {
                    console.log('Error in fetching all the records : ', err);
                });

            console.log('State : ', state);
        }

        // componentWillUnmount
        return () => {

            console.log('unmounting 1...');
            setState({
                ...state,
                reRender: false,
                toastChildren: []
            });
        }
    }, [state.reRender]);

    const [reRender, setReRender] = useState(false);

    useEffect(() => {
        console.log('mounted 2');
        setReRender(false);

        return () => {
            console.log('unmounting 2...');
        }
    }, [reRender])


    // Dynamically add multiple ToastMessage components.
    const addToastMessage = (messageType: string, message: string, isConfirm: boolean = false, articleId: string = '') => {

        setState({
            ...state,
            isConfirm: isConfirm
        });

        const toastChild = <ToastMessage displayToastMessage={true} toastMessageType={messageType} isConfirm={isConfirm} onConfirm={handleConfirmEvent.bind(this, articleId)} key={articleId + Math.floor((Math.random() * 100) + 1)}>{message}</ToastMessage>;

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
        dataService.createRecord(formDataObj).then((data: any) => {

            let articles = [data.newDoc, ...newState.articles];

            dispatch({ type: 'ADD_ARTICLE', articles: articles, currentRecord: data.newDoc });

            // display message
            addToastMessage('success', `New Article created successfully. ${data.newDoc.title}`)

            // Update variable value in articles.service.ts
            updateArticleDataService(newState.articles);
        }).catch((err) => {
            console.log('Error in creating new article', err);
        });


    }


    // Display Single Article Content
    // =========================================
    const handleDisplaySingleArticleContent = (articleId: string) => {
        dispatch({ type: 'GET_SINGLE_ARTICLE', articleId: articleId });
    }


    // Get Article data on click of Edit button
    // =========================================
    const handleEditArticle = (articleId: string, isFormVisible: boolean) => {
        UIkit.modal('#modal-articles').show();

        dispatch({ type: 'SET_EDIT_MODE', articleId: articleId });
    }


    // Update data on the server
    // =========================================
    const handleEditSaveArticle = (articleId: string, formDataObj: any) => {
        let articles = [...state.articles];

        dataService.editRecord(articleId, formDataObj).then((data: any) => {
            articles.map((article, index) => {
                if (article._id === data.docs[0]._id) {
                    articles[index] = { ...data.docs[0] };
                    articles[index] = data.docs[0];
                }
            });

            dispatch({ type: 'EDIT_ARTICLE', articles: articles, currentRecord: data.docs[0] });

            // display message
            addToastMessage('success', `Article updated successfully... ${data.docs[0].title}`);

            // Update variable value in articles.service.ts
            updateArticleDataService(newState.articles);

            // setReRender(true);
        }).catch((err: any) => {
            console.log('Error in edit or save article : ', err);
        });

        setState(state => ({
            ...newState,
            reRender: false
        }));
    }


    // Delete single article by articleId
    // =========================================
    const handleDeleteArticle = (articleId: string): void => {
        dataService.deleteRecord(articleId).then((data: any) => {

            dispatch({ type: 'DELETE_ARTICLE', data: data.docs });

            // display message
            addToastMessage('success', `Article ${articleId} deleted successfully.`, false);

            // Update variable value in articles.service.ts
            updateArticleDataService(newState.articles);

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
        dataService.setData(data);
    }

    const handleMarkAsFavorite = (articleId: string, isFavorite: boolean) => {
        dataService.markAsFavorite(articleId, isFavorite).then((data: any) => {
            let articles = [...newState.articles];
            articles.map((article: any, index: number) => {
                if (article._id === data.docs[0]._id) {
                    articles[index] = { ...data.docs[0] };
                    articles[index] = data.docs[0];
                }
            });

            dispatch({ type: 'MARK_FAVORITE', data: articles });
        });
    }


    // Filter all the articles by Tag, Category or the search value provided by the user
    // =========================================
    const handleFilterRecords = (event: any, filterBy: string) => {
        dispatch({ type: 'FILTER_ALL_ARTICLES', filteredRecords: utils.filterArticles(event, filterBy, newState.articles) });
    }

    const getUniqueTags = (articles: any) => {
        const uniqueTags = articles.map((article: any) => article.tags)
            .reduce((allTags: any, tags: any) => allTags.concat(tags), [])
            .reduce((uniqtags: any, tag: any) => {
                uniqtags[tag.trim()] = (uniqtags[tag.trim()] || 0) + 1
                return uniqtags;
            }, {});

        // OUTPUT : {JavaScript: 3, ES6: 3, React: 1, Form: 1}

        return uniqueTags;
    }

    const { articles, isEditMode, currentRecord, filteredRecords, loading, totalRecords } = newState;


    return (
        <main className="wrapper uk-offcanvas-content">
            <div className="container-fluid">

                <section className="content-wrapper">
                    {/* <div style={{ 'position': 'fixed', zIndex: 1050 }}>{isEditMode.toString()}</div> */}

                    <Header articles={articles} onFilterRecords={handleFilterRecords} {...props} />

                    <section className="content-section">

                        <CreateArticleFormComponent
                            {...newState}
                            onCreateArticle={handleCreateArticle}
                            onEditSaveArticle={handleEditSaveArticle}
                            firebase={firebase}
                        />

                        <ArticlesList
                            filteredRecords={filteredRecords}
                            loading={state.loading}
                            onAddToastMessage={addToastMessage.bind(this)}
                            onDeleteArticle={handleDeleteArticle}
                            onEditArticle={handleEditArticle}
                            onDisplaySingleArticleContent={handleDisplaySingleArticleContent}
                            onFilterRecords={handleFilterRecords}
                            markAsFavorite={handleMarkAsFavorite}
                        />

                        {
                            currentRecord ? (
                                <Article currentRecord={currentRecord} onFilterRecords={handleFilterRecords} />
                            ) : <p>No Article found</p>
                        }


                    </section>

                </section>
            </div>

            <div id="offcanvas-usage" uk-offcanvas="flip: true; overlay: true">
                <div className="uk-offcanvas-bar">
                    <button className="uk-offcanvas-close" type="button" uk-close=""></button>

                    <Sidebar onFilterRecords={handleFilterRecords} articleCount={totalRecords} {...newState} tags={state.tags} />
                </div>
            </div>
            <div className="toast-message__wrapper">{state.toastChildren}</div>
        </main>

    );
}

export default ArticleHome;
