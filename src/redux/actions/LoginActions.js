import { API, BASE_URL, DEVICE_TYPE } from "../constants";
import * as types from '../events/index';
import axios from "axios";

//==================================================================//
//===========================SIMPLE LOGIN===========================//
export const SimpleLoginAction = (payload) => {
    debugger
    let data = new FormData();
    data.append("email", payload.email);
    data.append("password", payload.password);
    data.append("device_type", DEVICE_TYPE);
    data.append("fcm_token", DEVICE_TYPE == 'Android' ? payload.deviceToken : null);
    data.append("apns_id", DEVICE_TYPE == 'IOS' ? payload.deviceToken : null);

    return function (dispatch) {
        axios.post("https://dev.afyanetwork.com/api/v2/login", data, {
            headers: {
                "Content-Type": "application/json",
            }
        }).then((response) => {
            dispatch(simpleLoginSuccess(response.data))
        })
            .catch((error) => {
                dispatch(simpleLoginFail(error))
            }).done();
        // fetch(BASE_URL + API.SIMPLE_LOGIN_API, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: data
        // })
        //     .then((response) => response.json())
        //     .then((responseData) => {
        //         dispatch(simpleLoginSuccess(responseData))
        //     })
        //     .catch((error) => {
        //         dispatch(simpleLoginFail(error))
        //     }).done();
    }
};
export const simpleLoginSuccess = (responseData) => {
    return {
        type: types.SIMPLE_LOGIN_SUCCESS,
        response: responseData
    }
};
export const simpleLoginFail = (error) => {
    return {
        type: types.SIMPLE_LOGIN_FAIL,
        error: error.message
    }
};

//==================================================================//
//============================SOCIAL LOGIN==========================//
export const SocialLoginAction = (payload) => {
    debugger
    let data = new FormData();
    data.append("provider_id", payload.social_id);
    data.append("provider_name", payload.social_type);
    data.append("device_type", DEVICE_TYPE);
    data.append("fcm_token", DEVICE_TYPE == 'Android' ? payload.deviceToken : null);
    data.append("apns_id", DEVICE_TYPE == 'IOS' ? payload.deviceToken : null);

    return function (dispatch) {
        fetch(BASE_URL + API.SOCIAL_LOGIN_API, {
            method: 'POST',
            headers: {},
            body: data
        })
            .then((response) => response.json())
            .then((responseData) => {
                dispatch(socialLoginSuccess(responseData))
            })
            .catch((error) => {
                dispatch(socialLoginFail(error))
            }).done();
    }
};
export const socialLoginSuccess = (responseData) => {
    return {
        type: types.SOCIAL_LOGIN_SUCCESS,
        response: responseData
    }
};
export const socialLoginFail = (error) => {
    return {
        type: types.SOCIAL_LOGIN_FAIL,
        error: error.message
    }
};
