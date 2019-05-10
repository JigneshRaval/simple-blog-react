const initialState: any = {
    username: null,
    gender: null,
    age: null
};

const UPDATE_USER: string = "UPDATE_USER";
const SET_GENDER: string = "SET_GENDER";
const SET_AGE: string = "SET_AGE";

function reducer(state: any, action: any) {
    switch (action.type) {
        case UPDATE_USER:
            return {
                username: action.username,
                gender: null,
                age: null
            };
        case SET_GENDER:
            return {
                username: state.username,
                gender: action.gender,
                age: null
            };
        case SET_AGE:
            return {
                username: state.username,
                gender: state.gender,
                age: action.age
            };
        default:
            return initialState;
    }
}
