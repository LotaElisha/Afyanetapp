import * as types from '../events'

const initialState = {
    response: undefined,

};
const SimpleLoginReducer = (state = initialState, action) => {

    switch (action.type) {

        case types.SIMPLE_LOGIN_SUCCESS:
            return {...state, loginResponse: action.response,};
        case types.SIMPLE_LOGIN_FAIL:
            return {...state, loginResponse: action.error};
        default:
            return state
    }
};


const SocialLoginReducer = (state = initialState, action) => {

    switch (action.type) {
        case types.SOCIAL_LOGIN_SUCCESS:
            return {...state, socialResponse: action.response,};
        case types.SOCIAL_LOGIN_FAIL:
            return {...state, socialResponse: action.error};
        default:
            return state
    }
};

export{
    SimpleLoginReducer,
    SocialLoginReducer
}

