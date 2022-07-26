import { API, BASE_URL } from "../constants";
import axios from "axios";
import { Platform } from "react-native";

//=====================DOCTOR DETAILS=====================//
export const DoctorDetailsApi = (payload, doctorDetailsApiResponse) => {
    axios.get(BASE_URL + API.DOCTOR_DETAILS_API + payload.id + '&addressTo=' + payload.addressTo, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + payload.token
        }
    }).then((response) => {
        doctorDetailsApiResponse(response.data)
    })
        .catch((error) => {
            doctorDetailsApiResponse(error)
        }).done();
};
