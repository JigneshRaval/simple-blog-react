function articleReducer(state: any, action: any) {
    switch (action.type) {
        case "GET_ALL_RECORDS":
            return {
                ...state,
                articles: action.data,
                totalRecords: action.data.length,
                filteredRecords: action.data,
                currentRecord: action.data[0],
                loading: false
            }
        case "SET_EDIT_MODE":
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
            return {
                ...state,
                totalRecords: action.articles.length,
                isEditMode: false,
                articles: action.articles,
                filteredRecords: action.articles,
                currentRecord: action.currentRecord,
                reRender: true
            };
        case "EDIT_ARTICLE":
            return {
                ...state,
                articles: action.articles,
                filteredRecords: action.articles,
                editData: {},
                isEditMode: false,
                currentRecord: action.currentRecord,
                reRender: true
            };
        case "DELETE_ARTICLE":
            return {
                ...state,
                totalRecords: state.articles.length,
                articles: action.data,
                filteredRecords: action.data,
                reRender: true
            };
        case "GET_SINGLE_ARTICLE":

            let singleArticle;

            state.articles.map((article: any, index: number) => {
                if (article._id === action.articleId) {
                    singleArticle = article;
                }
            });

            return {
                ...state,
                currentRecord: singleArticle
            };
        // return newState;
        case "FILTER_ALL_ARTICLES":
            return {
                ...state,
                filteredRecords: action.filteredRecords,
            };
        case "MARK_FAVORITE":

            return {
                ...state,
                filteredRecords: action.data
            };
        default:
            return state;
    }
}

export default articleReducer;
