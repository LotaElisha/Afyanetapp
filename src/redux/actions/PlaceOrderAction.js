import { API, BASE_URL } from "../constants";
import axios from "axios";

//=====================Order Medicine Prescription=====================//
export const MedicineOrderApi = (payload, testPresResponse) => {
    debugger
    let data = new FormData();
    data.append("patient_id", payload.patient_id);
    data.append("caretaker_id", payload.caretaker_id);
    data.append("user_type", 'patient');
    data.append("prescription", JSON.stringify(payload.prescription));
    data.append("pharmacy_id", payload.pharmacy_id);
    data.append("prescription_id", payload.prescription_id)
    axios.post(BASE_URL + API.ORDER_MEDICINE_TO_PHARMACY, data, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + payload.token
        }
    }).then((response) => {
        testPresResponse(response.data)
    })
        .catch((error) => {
            testPresResponse(error)
        }).done();
};

//=====================Order Test Prescription=====================//
export const TestOrderApi = (payload, testPresResponse) => {
    debugger
    let data = new FormData();
    data.append("patient_id", payload.patient_id);
    data.append("caretaker_id", payload.caretaker_id);
    data.append("service_ids", JSON.stringify(payload.service_ids));
    data.append("lab_id", payload.lab_id);
    data.append("prescription_id", payload.prescription_id)
    axios.post(BASE_URL + API.ORDER_TEST_TO_LAB, data, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + payload.token
        }
    }).then((response) => {
        testPresResponse(response.data)
    })
        .catch((error) => {
            testPresResponse(error)
        }).done();
};