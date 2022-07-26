import * as types from '../events'

const initialState = {
    startConsltationRespose: undefined,

};

 const StartConsltationReducer = (state = initialState, action) => {

    switch (action.type) {
        case types.START_CONSLTATION_REQUEST_SUCCESS:
            return {...state, startConsltationRespose: action.response,};
        case types.START_CONSLTATION_REQUEST_FAIL:
            return {...state, startConsltationRespose: action.error};
        default:
            return state
    }
};
export default StartConsltationReducer


