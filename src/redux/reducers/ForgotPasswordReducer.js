import * as types from '../events'

const initialState = {
    forgotResponse: undefined,

};
const ForgotPasswordReducer = (state = initialState, action) => {

    switch (action.type) {

        case types.FORGOT_PASSWORD_SUCCESS:

            return {...state, forgotResponse: action.response,};
        case types.FORGOT_PASSWORD_FAIL:
            return {...state, forgotResponse: action.error};
        default:
            return state
    }
};
export default ForgotPasswordReducer


