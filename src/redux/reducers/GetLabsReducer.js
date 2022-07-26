import * as types from '../events'

const initialState = {
    getLabsResponse: undefined,

};
const GetLabsReducer = (state = initialState, action) => {

    switch (action.type) {
        case types.GET_LABS_SUCCESS:
            return {...state, getLabsResponse: action.response,};
        case types.GET_LABS_FAIL:
            return {...state, getLabsResponse: action.error};
        default:
            return state
    }
};
export default GetLabsReducer


