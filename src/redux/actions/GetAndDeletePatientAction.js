import {API, BASE_URL} from "../constants";
import axios from "axios";

//=====================GET DOCTOR CONSULTATION REQUESTS API=====================//
export const GetPatientApi = (payload, getPatientApiResponse) => {
    axios.get(BASE_URL + API.GET_PATIENT + payload.id, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + payload.token
        }
    }).then((response) => {
        getPatientApiResponse(response.data)
    }).catch((error) => {
        getPatientApiResponse(error)
    }).done();
};

//=====================GET DOCTOR ACTIVE CONSULTATION API=====================//
export const RemovePatientApi = (payload, removePatientResponse) => {
    axios.get(BASE_URL + API.DELETE_PATIENT + payload.id, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + payload.token
        }
    }).then((response) => {
        removePatientResponse(response.data)
    }).catch((error) => {
        removePatientResponse(error)
    }).done();
};


