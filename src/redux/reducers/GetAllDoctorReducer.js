import * as types from '../events'

const initialState = {
    getAllDoctorResponse: undefined,

};
const GetAllDoctorReducer = (state = initialState, action) => {

    switch (action.type) {
        case types.GET_ALL_DOCTORS_LIST_SUCCESS:
            return {...state, getAllDoctorResponse: action.response,};
        case types.GET_ALL_DOCTORS_LIST_FAIL:
            return {...state, getAllDoctorResponse: action.error};
        default:
            return state
    }
};
export default GetAllDoctorReducer