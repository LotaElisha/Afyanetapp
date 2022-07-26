import {API, BASE_URL} from "../constants";
import * as types from '../events/index';

export const GetLabsAction = (payload) => {

    // let data = new FormData();
    // data.append("email", payload.email);

    return function (dispatch) {
        fetch(BASE_URL + API.GET_LABS_API +payload.searchText, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${"Bearer" + " " + payload.token}`
            },
        })
            .then((response) => response.json())
            .then((responseData) => {
                dispatch(LabsSuccess(responseData))
            })
            .catch((error) => {
                dispatch(LabsFail(error))
            }).done();
    }
};
export const LabsSuccess = (responseData) => {
    return {
        type: types.GET_LABS_SUCCESS,
        response: responseData
    }
};
export const LabsFail = (error) => {
    return {
        type: types.GET_LABS_FAIL,
        error: error.message
    }
};


