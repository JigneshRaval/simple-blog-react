function articleReducer(state: any, action: any) {
    switch (action.type) {
        case "ADD_ARTICLE":
            return {
                username: action.username,
                gender: null,
                age: null
            };
        case "EDIT_ARTICLE":
            let newState = {
                ...state,
                articles: action.articles,
                filteredArticles: action.articles,
                editData: {},
                isEditMode: false,
                currentArticle: action.currentArticle,
                reRender: true
            }
            console.log('EDIT_ARTICLE :', state, action.articles);
            return newState;
        case "DELETE_ARTICLE":
            return {
                username: state.username,
                gender: action.gender,
                age: null
            };
        case "MARK_FAVORITE":
            return {
                username: state.username,
                gender: state.gender,
                age: action.age
            };
        default:
            return state;
    }
}

export default articleReducer;
