import {API, BASE_URL} from "../constants";
import * as types from '../events/index';

//=====================LOGOUT=====================//
export const LogoutApi = (payload) => {

    return function (dispatch) {
        fetch(BASE_URL + API.LOGOUT_API, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${payload.idToken}`
            },
        })
            .then((response) => response.json())
            .then((responseData) => {
                dispatch(logoutSuccess(responseData))
            })
            .catch((error) => {
                dispatch(logoutFail(error))
            }).done();
    }
};
export const logoutSuccess = (responseData) => {
    return {
        type: types.LOGOUT_SUCCESS,
        response: responseData
    }
};
export const logoutFail = (error) => {
    return {
        type: types.LOGOUT_FAIL,
        error: error.message
    }
};
