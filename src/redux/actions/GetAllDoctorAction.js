import {API, BASE_URL} from "../constants";
import * as types from '../events/index';
import axios from "axios";

export const GetAllDoctorListAction = (payload) => {
    debugger
    return function (dispatch) {
        fetch(BASE_URL + API.GET_ALL_DOCTORS_LIST , {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${"Bearer" + " " + payload.token}`
            },
        })
        .then((response) => response.json())
            .then((responseData) => {
                dispatch(AllDoctorSuccess(responseData))
            })
            .catch((error) => {
                dispatch(AllDoctorFail(error))
            }).done();
    }
};
export const AllDoctorSuccess = (responseData) => {
    return {
        type: types.GET_ALL_DOCTORS_LIST_SUCCESS,
        response: responseData
    }
};
export const AllDoctorFail = (error) => {
    return {
        type: types.GET_ALL_DOCTORS_LIST_FAIL,
        error: error.message
    }
};


