import { API, BASE_URL } from "../constants";
import * as types from '../events/index';

export const GetGenDoctorAction = (payload) => {
    debugger
    return function (dispatch) {
        let data = new FormData();
        // data.append("doctor_type", 'General Physician');
        fetch(BASE_URL + API.GET_GENERAL_DOCTOR_API + payload.searchText + '&addressTo=' + payload.addressTo, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${"Bearer" + " " + payload.token}`,
                body: data
            },
        })
            .then((response) => response.json())
            .then((responseData) => {
                dispatch(GenDoctorSuccess(responseData))
            })
            .catch((error) => {
                dispatch(GenDoctorFail(error))
            }).done();
    }
};
export const GenDoctorSuccess = (responseData) => {
    return {
        type: types.GET_GENERAL_DOCTOR_SUCCESS,
        response: responseData
    }
};
export const GenDoctorFail = (error) => {
    return {
        type: types.GET_GENERAL_DOCTOR_FAIL,
        error: error.message
    }
};


