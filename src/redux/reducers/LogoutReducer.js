import * as types from '../events'

const initialState = {
    logoutResponse: undefined,

};
const LogoutReducer = (state = initialState, action) => {

    switch (action.type) {

        case types.LOGOUT_SUCCESS:

            return {...state, logoutResponse: action.response,};
        case types.LOGOUT_FAIL:
            return {...state, logoutResponse: action.error};

        default:
            return state
    }
};

export default LogoutReducer
