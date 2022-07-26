import {API, BASE_URL} from "../constants";
import * as types from '../events/index';
import axios from "axios";

export const ChangePasswordAction = (payload) => {
    debugger
    let data = new FormData();
    data.append("id", payload.id);
    data.append("current_password", payload.current_password);
    data.append("new_password", payload.new_password);
    data.append("confirm_new_password", payload.confirm_new_password);

    console.warn("payload", data)
    return function (dispatch) {
        axios.post(BASE_URL + API.CHANGE_PASSWORD_API, data, {
            headers: {
                'Authorization': "Bearer " + payload.token
            }
        }).then((response) => {
            dispatch(ChangePasswordSuccess(response.data))
        })
            .catch((error) => {
                dispatch(ChangePasswordFail(error))
            }).done();
    }
};
export const ChangePasswordSuccess = (responseData) => {
    return {
        type: types.CHANGE_PASSWORD_SUCCESS,
        response: responseData
    }
};
export const ChangePasswordFail = (error) => {
    return {
        type: types.CHANGE_PASSWORD_FAIL,
        error: error.message
    }
};