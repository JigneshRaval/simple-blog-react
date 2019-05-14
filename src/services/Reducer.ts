const initialState: any = {
    username: null,
    gender: null,
    age: null
};


function articleReducer(state: any, action: any) {
    switch (action.type) {
        case "ADD_ARTICLE":
            return {
                username: action.username,
                gender: null,
                age: null
            };
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
            return initialState;
    }
}

export default articleReducer;
