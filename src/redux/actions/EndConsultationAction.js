import { API, BASE_URL } from "../constants";
import axios from "axios";

//=====================End Consultation=====================//
export const EndConsultationApi = (payload, consultationResponse) => {
    let data = new FormData();
    data.append("request_id", payload.request_id);
    axios.post(BASE_URL + API.END_CONSULTATION_API, data, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + payload.token
        }
    }).then((response) => {
        consultationResponse(response.data)
    })
        .catch((error) => {
            consultationResponse(error)
        }).done();
};