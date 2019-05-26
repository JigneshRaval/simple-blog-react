function articleReducer(state: any, action: any) {
    switch (action.type) {
        case "GET_ALL_ARTICLES":
            console.log('GET_ALL_ARTICLES :', state, action);
            return {
                ...state,
                articles: action.data,
                articleCount: action.data.length,
                filteredArticles: action.data,
                currentArticle: action.data[0],
                loading: false
            }
        case "SET_EDIT_MODE":
            console.log('SET_EDIT_MODE :', state, action);
            let articleToEdit;
            state.articles.map((article: any) => {
                if (article._id === action.articleId) {
                    articleToEdit = article;
                }
            });

            return {
                ...state,
                isEditMode: true,
                editData: articleToEdit
            }
        case "ADD_ARTICLE":
            console.log('ADD_ARTICLE :', state, action);
            return {
                ...state,
                articleCount: action.articles.length,
                isEditMode: false,
                articles: action.articles,
                filteredArticles: action.articles,
                currentArticle: action.currentArticle,
                reRender: true
            };
        case "EDIT_ARTICLE":
            console.log('EDIT_ARTICLE :', state, action);
            return {
                ...state,
                articles: action.articles,
                filteredArticles: action.articles,
                editData: {},
                isEditMode: false,
                currentArticle: action.currentArticle,
                reRender: true
            };
        case "DELETE_ARTICLE":
            return {
                ...state,
                articleCount: state.articles.length,
                articles: action.data,
                filteredArticles: action.data,
                reRender: true
            };
        case "GET_SINGLE_ARTICLE":
            console.log('GET_SINGLE_ARTICLE :', state, action);
            let singleArticle;

            state.articles.map((article: any, index: number) => {
                if (article._id === action.articleId) {
                    singleArticle = article;
                }
            });

            return {
                ...state,
                currentArticle: singleArticle
            };
        // return newState;
        case "FILTER_ALL_ARTICLES":
            return {
                ...state,
                filteredArticles: action.filteredArticles,
            };
        case "MARK_FAVORITE":

            return {
                ...state,
                filteredArticles: action.data
            };
        default:
            return state;
    }
}

export default articleReducer;
