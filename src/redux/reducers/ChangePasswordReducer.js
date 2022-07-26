import * as types from '../events'

const initialState = {
    changePasswordResponse: undefined,

};
const ChangePasswordReducer = (state = initialState, action) => {

    switch (action.type) {
        case types.CHANGE_PASSWORD_SUCCESS:
            return {...state, changePasswordResponse: action.response,};
        case types.CHANGE_PASSWORD_FAIL:
            return {...state, changePasswordResponse: action.error};
        default:
            return state
    }
};
export default ChangePasswordReducer


