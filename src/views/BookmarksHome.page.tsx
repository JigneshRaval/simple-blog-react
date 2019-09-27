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
import BookmarkList from "../components/bookmarks/BookmarkList.component";
import ToastMessage from "../components/articles/ToastMessage";
import { Article } from "../components/articles/Article.component";
import { CreateBookmarkFormComponent } from '../components/bookmarks/CreateBookmarkForm.component';

import articleReducer from '../services/Reducer';

declare var require: any;
let categories = require('../assets/data/categories.json');
const utils = new Utils();
const dataService = new DataService('bookmarks');

// declare var UIkit: any;

const BookmarkHome = () => {

    const [state, setState] = useState({
        dataService: new DataService('bookmarks'),
        articles: [],
        articleCount: 0,
        editData: {},
        currentArticle: '',
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

            document.getElementsByTagName('body')[0].classList.remove('isArticleListPanelOpened');

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
                .then(data => {
                    // Update variable value in articles.service.ts
                    updateBookmarkDataService(data);

                    setState({
                        ...state,
                        tags: getUniqueTags(data)
                    });

                })
                .catch((err: any) => {
                    console.log('Error in fetching all the records : ', err);
                });

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
            handleDeleteBookmark(articleId);
        }
    }

    // Create new article
    // =========================================
    const handleCreateBookmark = (formDataObj: any) => {
        dataService.createRecord(formDataObj).then((data: any) => {

            let articles = [data.newDoc, ...newState.articles];

            dispatch({ type: 'ADD_ARTICLE', articles: articles, currentArticle: data.newDoc });

            // display message
            addToastMessage('success', `New Article created successfully. ${data.newDoc.title}`)

            // Update variable value in articles.service.ts
            updateBookmarkDataService(newState.articles);
        }).catch((err) => {
            console.log('Error in creating new article', err);
        });


    }


    // Get Article data on click of Edit button
    // =========================================
    const handleEditBookmark = (articleId: string, isFormVisible: boolean) => {
        // UIkit.modal('#modal-bookmarks').show();

        dispatch({ type: 'SET_EDIT_MODE', articleId: articleId });
    }


    // Update data on the server
    // =========================================
    const handleEditSaveBookmark = (articleId: string, formDataObj: any) => {
        let articles = [...state.articles];

        dataService.editRecord(articleId, formDataObj).then((data: any) => {
            articles.map((article, index) => {
                if (article._id === data.docs[0]._id) {
                    articles[index] = { ...data.docs[0] };
                    articles[index] = data.docs[0];
                }
            });

            dispatch({ type: 'EDIT_ARTICLE', articles: articles, currentArticle: data.docs[0] });

            // display message
            addToastMessage('success', `Article updated successfully... ${data.docs[0].title}`);

            // Update variable value in articles.service.ts
            updateBookmarkDataService(newState.articles);

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
    const handleDeleteBookmark = (articleId: string): void => {
        dataService.deleteRecord(articleId).then((data: any) => {

            dispatch({ type: 'DELETE_ARTICLE', data: data.docs });

            // display message
            addToastMessage('success', `Article ${articleId} deleted successfully.`, false);

            // Update variable value in articles.service.ts
            updateBookmarkDataService(newState.articles);

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
    const updateBookmarkDataService = (data: any) => {
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

    const { articles, isEditMode, currentArticle, filteredRecords, loading, articleCount } = newState;


    return (
        <main className="wrapper uk-offcanvas-content">
            <div className="container-fluid">

                <section className="content-wrapper">
                    {/* <div style={{ 'position': 'fixed', zIndex: 1050 }}>{isEditMode.toString()}</div> */}

                    <Header articles={articles} onFilterRecords={handleFilterRecords} />

                    <section className="content-section">

                        <CreateBookmarkFormComponent
                            {...newState}
                            onCreateBookmark={handleCreateBookmark}
                            onEditSaveBookmark={handleEditSaveBookmark}
                        />

                        <BookmarkList
                            filteredRecords={filteredRecords}
                            loading={state.loading}
                            onAddToastMessage={addToastMessage.bind(this)}
                            onDeleteBookmark={handleDeleteBookmark}
                            onEditRecord={handleEditBookmark}
                            onFilterRecords={handleFilterRecords}
                            markAsFavorite={handleMarkAsFavorite}
                        />

                    </section>

                </section>
            </div>

            <div id="offcanvas-usage" uk-offcanvas="flip: true; overlay: true">
                <div className="uk-offcanvas-bar">
                    <button className="uk-offcanvas-close" type="button" uk-close=""></button>

                    <Sidebar onFilterRecords={handleFilterRecords} articleCount={articleCount} {...newState} tags={state.tags} />
                </div>
            </div>
            <div className="toast-message__wrapper">{state.toastChildren}</div>
        </main>

    );
}

export default BookmarkHome;
