import * as types from '../events'

const initialState = {
    getPharmacyResponse: undefined,

};
const GetPharmacyReducer = (state = initialState, action) => {

    switch (action.type) {
        case types.GET_PHARMACY_SUCCESS:
            return {...state, getPharmacyResponse: action.response,};
        case types.GET_PHARMACY_FAIL:
            return {...state, getPharmacyResponse: action.error};
        default:
            return state
    }
};
export default GetPharmacyReducer