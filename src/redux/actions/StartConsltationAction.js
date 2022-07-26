import {API, BASE_URL} from "../constants";
import * as types from '../events/index';
import axios from "axios";

export const StartConsltationAction = (payload) => {
    let data = new FormData();
    data.append("doctor_id", payload.doctorId);
    data.append("caretaker_id", payload.userId);
    data.append("status", "requested");
    data.append("consulted_for", payload.consulted_for);
    data.append("patient_id", payload.patient_id);
    data.append("caretaker_message", payload.message);
    data.append("date", new Date().toString().substr(4, 11));
    data.append("time", new Date().toString().substr(16, 9));

    console.warn("payload", data)
    return function (dispatch) {
        axios.post(BASE_URL + API.START_CONSLTATION_REQUEST_API, data, {
            headers: {
                'Authorization': "Bearer " + payload.token
            }
        }).then((response) => {
            dispatch(StartConsltationSuccess(response.data))
        })
            .catch((error) => {
                dispatch(StartConsltationFail(error))
            }).done();
    }
};
export const StartConsltationSuccess = (responseData) => {
    return {
        type: types.START_CONSLTATION_REQUEST_SUCCESS,
        response: responseData
    }
};
export const StartConsltationFail = (error) => {
    return {
        type: types.START_CONSLTATION_REQUEST_FAIL,
        error: error.message
    }
};


