import React, { useReducer, useEffect, useState, lazy, Suspense } from 'react';
// import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';


// SERVICES
// ==========================
import { DataService } from '../services/data.service';
// import ArticleContext from '../services/context';
import articleReducer from '../services/Reducer';
import { IndexedDBService } from '../services/indexedDb.service';
import Utils from '../services/utils';


// COMPONENTS
// ==========================
import Header from '../components/articles/Header.component';
import Sidebar from '../components/articles/Sidebar.component';
// import ArticlesList from '../components/articles/Articles-List.component';
import ToastMessage from '../components/articles/ToastMessage';
import { Article } from '../components/articles/Article.component';
import { CreateArticleFormComponent } from '../components/articles/Create-Article-Form.component';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import SimpleUncontrolledForm from '../components/articles/SimpleUncontrolledForm';

// A dynamic import call in ES5/ES3 requires the 'Promise' constructor.
// Make sure you have a declaration for the 'Promise' constructor or include 'ES2015' in your`--lib` option.ts(2712)
// update tsconfig.json with "compilerOptions": { "lib": [ "dom", "es2015", "es6"] }
const ArticlesList = React.lazy(() => import('../components/articles/Articles-List.component'));


// FIREBASE
// ==========================
// import firebase from '../firebase';
// const dbRef = firebase.database().ref('articles');
// dbRef.on("value", function (snapshot) {
//     console.log('Firebase snapshot ==', snapshot.val());
// });

declare var require: any;
// declare var UIkit: any;
declare var $: any;

let categories = require('../assets/data/categories.json');
const utils = new Utils();
const dataService = new DataService('articles');
let idbService = new IndexedDBService();

const initialState: any = {
    dataService: new DataService('articles'),
    articles: [],
    totalRecords: 0,
    editData: {},
    currentRecord: '',
    filteredRecords: [],
    categories: categories.categories,
    isEditMode: false,
    toastChildren: [],
    isConfirm: false,
    tags: {}
};

const ArticleHome = (props: any) => {

    const [state, setState] = useState(initialState);

    // Show loading spinner icon, when ajax request is running,
    const [isLoading, setIsLoading] = React.useState(false);

    const [reRender, setReRender] = useState(false);

    const [newState, dispatch] = useReducer(articleReducer, initialState);

    useEffect(() => {
        // componentDidMount, componentDidUpdate, and componentWillUnmount
        console.log('Rendering ArticleHome page.');

        // idbService.openDatabase({});

        // setReRender(true);

        // if (reRender) {
        // Show loading indicator
        setIsLoading(true);

        utils.isServerOnline();

        // document.getElementsByTagName('body')[0].classList.add('isArticleListPanelOpened');

        // setTimeout(() => {
        fetchAllRecords();
        // }, 2500)


        // }

        // const pollForData = setInterval(() => fetchAllRecords(), 5000);
        // componentWillUnmount
        return () => {
            console.log('Unmounting ArticleHome component...');
            // setReRender(false);
            setState({
                ...state,
                toastChildren: []
            });
            // clearTimeout(pollForData);
        }

    }, []);


    const fetchAllRecords = () => {
        // Get all Articles on component mount
        dataService.getAllRecords()
            .then((data: any) => {
                setIsLoading(false);
                dispatch({ type: 'GET_ALL_RECORDS', data: data.docs })

                return data.docs;
            })
            .then((data: any) => {
                // Update variable value in data.service.ts
                updateArticleDataService(data);
                /* setState({
                    ...state,
                    tags: utils.getUniqueTags(data)
                }); */
            })
            .catch((error: any) => {
                console.log('Error in fetching all the records : ', error);
            });
    }


    // Dynamically add multiple ToastMessage components.
    const addToastMessage = (messageType: string, message: string, isConfirm: boolean = false, articleId: string = '') => {

        setState({
            ...state,
            isConfirm: isConfirm
        });

        const toastChild = <ToastMessage displayToastMessage={true} toastMessageType={messageType} isConfirm={isConfirm} onConfirm={handleConfirmEvent.bind(this, articleId)} key={articleId + Math.floor((Math.random() * 100) + 1)}>{message}</ToastMessage>;

        const newChildren = [...state.toastChildren, toastChild];

        setState((prevState: any) => ({
            ...state,
            toastChildren: newChildren
        }));
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

            // setReRender(true);
        }).catch((err) => {
            console.log('Error in creating new article', err);
        });

        // setReRender(false);
    }


    // Display Single Article Content
    // =========================================
    const handleDisplaySingleArticleContent = (articleId: string) => {
        dispatch({ type: 'GET_SINGLE_ARTICLE', articleId: articleId });
    }


    // Get Article data on click of Edit button
    // =========================================
    const handleEditArticle = (articleId: string, isFormVisible: boolean) => {
        // UIkit.modal('#modal-articles').show();

        $('#modal-articles').modal('show');

        dispatch({ type: 'SET_EDIT_MODE', articleId: articleId });
    }

    const resetEditMode = () => {
        dispatch({ type: 'RESET_EDIT_MODE' });
    }


    // Update data on the server
    // =========================================
    const handleEditSaveArticle = (articleId: string, formDataObj: any) => {
        let articles = [...newState.articles];

        dataService.editRecord(articleId, formDataObj).then((data: any) => {

            articles.map((article, index) => {
                if (article._id === data.docs[0]._id) {
                    articles[index] = { ...data.docs[0] };
                    articles[index] = data.docs[0];
                }
            });

            // setReRender(true);
            dispatch({ type: 'EDIT_ARTICLE', articles: articles, currentRecord: data.docs[0] });

            // display message
            addToastMessage('success', `Article updated successfully... ${data.docs[0].title}`);

            // Update variable value in articles.service.ts
            updateArticleDataService(newState.articles);

            // setReRender(true);
        }).catch((err: any) => {
            console.log('Error in edit or save article : ', err);
        });

        // setReRender(false);
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
            // setReRender(true);
        }).catch((err: any) => {
            console.log('Error in deleting article : ', err);
        });

        // setReRender(false);
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

    const { articles, isEditMode, currentRecord, filteredRecords, loading, totalRecords, editData } = newState;


    return (
        <main className="wrapper uk-offcanvas-content">
            <div className="container-fluid">

                <section className="content-wrapper">
                    {/* <div style={{ 'position': 'fixed', zIndex: 1050 }}>{isEditMode.toString()}</div> */}

                    <Header
                        articles={articles}
                        onFilterRecords={handleFilterRecords}
                        onResetEditMode={resetEditMode}
                        {...props}
                    />

                    <Suspense fallback={<div>Loading 123...</div>}>
                        <div className="post-list__wrapper" >
                            <div className="uk-flex uk-flex-column">
                                <ArticlesList
                                    filteredRecords={filteredRecords}
                                    loading={isLoading}
                                    onAddToastMessage={addToastMessage.bind(this)}
                                    onDeleteArticle={handleDeleteArticle}
                                    onEditRecord={handleEditArticle}
                                    onDisplaySingleArticleContent={handleDisplaySingleArticleContent}
                                    onFilterRecords={handleFilterRecords}
                                    markAsFavorite={handleMarkAsFavorite}
                                />
                            </div>
                        </div>
                    </Suspense>

                    <section className="content-section">

                        {
                            currentRecord ? (
                                <Article currentRecord={currentRecord} onFilterRecords={handleFilterRecords} />
                            ) : <LoadingSpinner text={'Loading article data...'} />
                        }

                    </section>

                </section>
            </div>

            <SimpleUncontrolledForm
                categories={newState.categories}
                editData={editData}
                isEditMode={isEditMode}
                onCreateArticle={handleCreateArticle}
                onEditSaveArticle={handleEditSaveArticle}
            />

            {/* <CreateArticleFormComponent
                {...newState}
                onCreateArticle={handleCreateArticle}
                onEditSaveArticle={handleEditSaveArticle}
            // firebase={firebase}
            /> */}

            <Sidebar
                onFilterRecords={handleFilterRecords}
                articleCount={totalRecords}
            // {...newState}
            // tags={state.tags}
            />

            <div className="toast-message__wrapper">{state.toastChildren}</div>
        </main>

    );
};

export default ArticleHome;
