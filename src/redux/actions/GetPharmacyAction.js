import {API, BASE_URL} from "../constants";
import * as types from '../events/index';

export const GetPharmacyAction = (payload) => {
    return function (dispatch) {
        fetch(BASE_URL + API.GET_PHARMACY_API +payload.searchText, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${"Bearer" + " " + payload.token}`
            },
        })
            .then((response) => response.json())
            .then((responseData) => {
                dispatch(PharmacySuccess(responseData))
            })
            .catch((error) => {
                dispatch(PharmacyFail(error))
            }).done();
    }
};
export const PharmacySuccess = (responseData) => {
    return {
        type: types.GET_PHARMACY_SUCCESS,
        response: responseData
    }
};
export const PharmacyFail = (error) => {
    return {
        type: types.GET_PHARMACY_FAIL,
        error: error.message
    }
};


//=====================GET DOCTOR STATUS API=====================//
export const GetPharmacyDetails = (payload, getPharmacyDetailsResponse) => {
    fetch(BASE_URL + API.GET_PHARMACY_DETAILS + payload.id, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + payload.token
        }
    })
        .then((response) => response.json())
        .then((responseData) => {
            getPharmacyDetailsResponse(responseData)
        })
        .catch((error) => {
            getPharmacyDetailsResponse(error)
        }).done();
};

//=====================GET DOCTOR STATUS API=====================//
export const GetLabsDetails = (payload, getLabDetailsResponse) => {
    fetch(BASE_URL + API.GET_LABS_DETAILS + payload.id, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + payload.token
        }
    })
        .then((response) => response.json())
        .then((responseData) => {
            getLabDetailsResponse(responseData)
        })
        .catch((error) => {
            getLabDetailsResponse(error)
        }).done();
};
