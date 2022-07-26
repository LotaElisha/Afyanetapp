import {API, BASE_URL} from "../constants";
import axios from "axios";

//=====================GET DOCTOR STATUS API=====================//
export const GetDoctorStatusApi = (payload, getDoctorStatusApiResponse) => {
    fetch(BASE_URL + API.GET_DOCTOR_STATUS_API + payload.id, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + payload.token
        }
    })
        .then((response) => response.json())
        .then((responseData) => {
            getDoctorStatusApiResponse(responseData)
        })
        .catch((error) => {
            getDoctorStatusApiResponse(error)
        }).done();
};


//=====================CHANGE DOCTOR STATUS API=====================//
export const ChangeDoctorStatusApi = (payload, chnageDoctorStatusApiResponse) => {
    let data = new FormData();
    data.append("id", payload.id);
    data.append("status", payload.status);

    axios.post(BASE_URL + API.CHANGE_DOCTOR_STATUS_API, data, {
        headers: {
            "Authorization": "Bearer " + payload.token
        },
    }).then((response) => {
        chnageDoctorStatusApiResponse(response.data)
    })
        .catch((error) => {
            chnageDoctorStatusApiResponse(error)
        }).done();
};
