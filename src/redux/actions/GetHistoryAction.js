import {API, BASE_URL} from "../constants";
import axios from "axios";

export const  GetConsultationHistoryApi = (payload, getConsultationHistoryApiResponse) => {
    let url=BASE_URL + API.PATIENT_HISTORY_LIST_API + payload.id

    axios.get( url, {
         headers: {
             "Content-Type": "application/json",
             "Authorization": "Bearer " + payload.token
         }
     }).then((response) => {      
        getConsultationHistoryApiResponse(response.data)
     }).catch((error) => {
        console.log("error is",error)
        getConsultationHistoryApiResponse(error)
     }).done();
 };

 export const  GetLabHistoryApi = (payload, getConsultationHistoryApiResponse) => {
    let url=BASE_URL + API.PATIENT_LAB_HISTORY_LIST_API + payload.id
    axios.get( url, {
         headers: {
             "Content-Type": "application/json",
             "Authorization": "Bearer " + payload.token
         }
     }).then((response) => {      
        getConsultationHistoryApiResponse(response.data)
     }).catch((error) => {
        console.log("error is",error)
        getConsultationHistoryApiResponse(error)
     }).done();
 };

 export const  GetPharmacyHistoryApi = (payload, getConsultationHistoryApiResponse) => {
    let url=BASE_URL + API.PATIENT_PHARMACY_HISTORY_LIST_API + payload.id
    axios.get( url, {
         headers: {
             "Content-Type": "application/json",
             "Authorization": "Bearer " + payload.token
         }
     }).then((response) => {      
        getConsultationHistoryApiResponse(response.data)
     }).catch((error) => {
        console.log("error is",error)
        getConsultationHistoryApiResponse(error)
     }).done();
 };