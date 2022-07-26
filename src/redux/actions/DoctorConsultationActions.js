import { API, BASE_URL } from "../constants";
import axios from "axios";

//=====================GET DOCTOR CONSULTATION REQUESTS API=====================//
export const GetDoctorConsultationRequestsApi = (payload, getDoctorConsultationRequestsApiResponse) => {
    axios.get(BASE_URL + API.GET_DOCTOR_CONSULTATION_REQUESTS_API + payload.id, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + payload.token
        }
    }).then((response) => {
        getDoctorConsultationRequestsApiResponse(response.data)
    }).catch((error) => {
        getDoctorConsultationRequestsApiResponse(error)
    }).done();
};

//=====================GET DOCTOR ACTIVE CONSULTATION API=====================//
export const GetDoctorActiveConsultationApi = (payload, getDoctorActiveConsultationApiResponse) => {
    axios.get(BASE_URL + API.GET_DOCTOR_ACTIVE_CONSULTATIONS_API + payload.id + '&addressTo=' + payload.addressTo, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + payload.token
        }
    }).then((response) => {
        getDoctorActiveConsultationApiResponse(response.data)
    }).catch((error) => {
        getDoctorActiveConsultationApiResponse(error)
    }).done();
};


//=====================GET CONSULTATION REQUESTS DETAILS API=====================//
export const GetConsultationRequestDetailsApi = (payload, getConsultationRequestDetailsApiResponse) => {
    axios.get(BASE_URL + API.GET_CONSULTATION_REQUEST_DETAILS_API + payload.id + '&addressTo=' + payload.addressTo, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + payload.token
        }
    }).then((response) => {
        getConsultationRequestDetailsApiResponse(response.data)
    }).catch((error) => {
        getConsultationRequestDetailsApiResponse(error)
    }).done();
};

//=====================ACCEPT/REJECT CONSULTATION REQUEST API=====================//
export const ChangeConsultationRequestStatusApi = (payload, changeConsultationRequestStatusApiResponse) => {
    let data = new FormData();
    if (payload.status === "rejected") {
        data.append("id", payload.id);
        data.append("status", 'rejected');
        data.append("rejection_note", payload.rejection_note);
        data.append("consult_another_doctor", payload.consult_another_doctor);
    } else {
        data.append("id", payload.id);
        data.append("status", payload.status);
    }

    axios.post(BASE_URL + API.CHANGE_CONSULTATION_REQUEST_STATUS_API, data, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + payload.token
        }
    }).then((response) => {
        changeConsultationRequestStatusApiResponse(response.data)
    }).catch((error) => {
        changeConsultationRequestStatusApiResponse(error)
    }).done();
};

////////============================doctor history consultation==========
export const GetConsultationHistoryApi = (payload, getConsultationHistoryApiResponse) => {
    let url = BASE_URL + API.DR_CONSULTATION_HISTORY_BY_STATUS + payload.id + '&search_keyword=' + payload.searchText + '&status=' + payload.status
    axios.get(url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + payload.token
        }
    }).then((response) => {
        getConsultationHistoryApiResponse(response.data)
    }).catch((error) => {
        getConsultationHistoryApiResponse(error)
    }).done();
};


//======================= Notificaiton data ======================
export const GetNotificationData = (payload, notificationResponse) => {
    let url = BASE_URL + API.GET_NOTIFICATION_HISTORY + payload.id
    axios.get(url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + payload.token
        }
    }).then((response) => {
        notificationResponse(response.data)
    }).catch((error) => {
        notificationResponse(error)
    }).done();
};

//=====================GET CONSULTATION DETAILS API=====================//
export const GetActiveConsultationDetailApi = (payload, getConsultationDetailsApiResponse) => {
    debugger
    let url = payload.is_doctor ? payload.request_id + '&doctor_id=' + payload.doctor_id : payload.request_id + '&caretaker_id=' + payload.caretaker_id
    axios.get(BASE_URL + API.GET_ACTIVE_CONSULTATION_DETAIL + url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + payload.token
        }
    }).then((response) => {
        getConsultationDetailsApiResponse(response.data)
    }).catch((error) => {
        getConsultationDetailsApiResponse(error)
    }).done();
};