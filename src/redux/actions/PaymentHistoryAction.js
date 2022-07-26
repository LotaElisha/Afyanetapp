import { API, BASE_URL } from "../constants";
import axios from "axios";

export const GetPaymentHistoryApi = (payload, getPaymentHistoryApiResponse) => {

    let URL = payload.userType === "doctor" ? API.GET_DOCTOR_PAYMENT_HISTORY_API : API.GET_PATIENT_PAYMENT_HISTORY_API
    debugger
    let data = new FormData();
    data.append("user_id", payload.user_id);
    axios.post(BASE_URL + URL, data, {
        headers: {

        }
    }).then((response) => {
        getPaymentHistoryApiResponse(response.data)
    }).catch((error) => {
        getPaymentHistoryApiResponse(error)
    }).done();
};