import * as types from '../events'

const initialState = {
    activeConsltationResponse: undefined,
    previousConsltationResponse: undefined,
};

 const PreviousConsltationReducer = (state = initialState, action) => {

    switch (action.type) {
        case types.PREVIOUS_CONSLTATION_PATIENT_SUCCESS:
            return {...state, previousConsltationResponse: action.response,};
        case types.PREVIOUS_CONSLTATION_PATIENT_FAIL:
            return {...state, previousConsltationResponse: action.error};
        default:
            return state
    }
};
const ActiveConsltationReducer = (state = initialState, action) => {

    switch (action.type) {
        case types.ACTIVE_CONSLTATION_PATIENT_SUCCESS:
            return {...state, activeConsltationResponse: action.response,};
        case types.ACTIVE_CONSLTATION_PATIENT_FAIL:
            return {...state, activeConsltationResponse: action.error};
        default:
            return state
    }
};
export { PreviousConsltationReducer,ActiveConsltationReducer}


