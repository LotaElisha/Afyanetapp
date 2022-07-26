import * as types from '../events'

const initialState = {
    specializedDocResponse: undefined,

};

 const SpecializationReducer = (state = initialState, action) => {

    switch (action.type) {
        case types.GET_SPECILALIZED_DOCTOR_SUCCESS:
            return {...state, specializedDocResponse: action.response,};
        case types.GET_SPECILALIZED_DOCTOR_FAIL:
            return {...state, specializedDocResponse: action.error};
        default:
            return state
    }
};
export default SpecializationReducer


