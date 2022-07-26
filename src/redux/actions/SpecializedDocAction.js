import { API, BASE_URL } from "../constants";
import * as types from '../events/index';

export const SpecializationAction = (payload) => {
    debugger
    // let data = new FormData();
    // data.append("email", payload.email);
    return function (dispatch) {
        fetch(BASE_URL + API.GET_DOCTOR_SPECIALIZATION_SEARCH_LIST_API + payload.searchText + '&addressTo=' + payload.addressTo, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${"Bearer" + " " + payload.token}`
            },
        })
            .then((response) => response.json())
            .then((responseData) => {
                dispatch(SpecializedDocSuccess(responseData))
            })
            .catch((error) => {
                dispatch(SpecializedDocFail(error))
            }).done();
    }
};
export const SpecializedDocSuccess = (responseData) => {
    return {
        type: types.GET_SPECILALIZED_DOCTOR_SUCCESS,
        response: responseData
    }
};
export const SpecializedDocFail = (error) => {
    return {
        type: types.GET_SPECILALIZED_DOCTOR_FAIL,
        error: error.message
    }
};


