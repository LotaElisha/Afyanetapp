import {API, BASE_URL} from "../constants";
import * as types from '../events/index';

export const ForgotPasswordAction = (payload) => {
    debugger
    let data = new FormData();
    data.append("email", payload.email);

    return function (dispatch) {
        fetch(BASE_URL + API.FORGOT_PASSWORD, {
            method: 'POST',
            headers: {
            },
            body: data
        })
            .then((response) => response.json())
            .then((responseData) => {
                dispatch(ForgotSuccess(responseData))
            })
            .catch((error) => {
                dispatch(ForgotFail(error))
            }).done();
    }
};

export const ForgotSuccess = (responseData) => {
    return {
        type: types.FORGOT_PASSWORD_SUCCESS,
        response: responseData
    }
};
export const ForgotFail = (error) => {
    return {
        type: types.FORGOT_PASSWORD_FAIL,
        error: error.message
    }
};


