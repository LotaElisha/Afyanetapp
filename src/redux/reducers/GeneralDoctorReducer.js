import * as types from '../events'

const initialState = {
    genDoctorResponse: undefined,

};
const GenDoctorReducer = (state = initialState, action) => {

    switch (action.type) {
        case types.GET_GENERAL_DOCTOR_SUCCESS:
            return {...state, genDoctorResponse: action.response,};
        case types.GET_GENERAL_DOCTOR_FAIL:
            return {...state, genDoctorResponse: action.error};
        default:
            return state
    }
};
export default GenDoctorReducer


