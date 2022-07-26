import {API, BASE_URL} from "../constants";
import * as types from '../events/index';

export const ActiveConsltationAction = (payload) => {


    return function (dispatch) {
        fetch(`${BASE_URL + API.ACTIVE_PATIENT_CONSULTATION_API+payload.careTakerId}` , {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${"Bearer" + " " + payload.token}`
            },
        })
            .then((response) => response.json())
            .then((responseData) => {
                dispatch(ActiveConsultationSuccess(responseData))
            })
            .catch((error) => {
                dispatch(ActiveConsultationFail(error))
            }).done();
    }
};
export const ActiveConsultationSuccess = (responseData) => {
    return {
        type: types.ACTIVE_CONSLTATION_PATIENT_SUCCESS,
        response: responseData
    }
};
export const ActiveConsultationFail = (error) => {
    return {
        type: types.ACTIVE_CONSLTATION_PATIENT_FAIL,
        error: error.message
    }
};
///////============================previous consltation=================

export const PreviousConsltationAction = (payload) => {



    return function (dispatch) {
        fetch(`${BASE_URL + API.PREVOIUS_PATIENT_CONSULTATION_API +payload.careTakerId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${"Bearer" + " " + payload.token}`
            },
        })
            .then((response) => response.json())
            .then((responseData) => {
                dispatch(PreviousConsltationSuccess(responseData))
            })
            .catch((error) => {
                dispatch(PreviousConsltationFail(error))
            }).done();
    }
};
export const PreviousConsltationSuccess = (responseData) => {
    return {
        type: types.PREVIOUS_CONSLTATION_PATIENT_SUCCESS,
        response: responseData
    }
};
export const PreviousConsltationFail = (error) => {
    return {
        type: types.PREVIOUS_CONSLTATION_PATIENT_FAIL,
        error: error.message
    }
};


