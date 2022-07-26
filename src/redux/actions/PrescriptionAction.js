import { API, BASE_URL } from "../constants";
import axios from "axios";

////////============================Get Test List=========================
export const GetTestListApi = (payload, TestResponse) => {
    
    axios.get(BASE_URL + API.GET_TEST_LIST_API, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + payload.token
        }
    }).then((response) => {
        TestResponse(response.data)
    }).catch((error) => {
        TestResponse(error)
    }).done();
};

//=====================Submit Test Prescription=====================//
export const TestSubmitApi = (payload, testPresResponse) => {
    
    let data = new FormData();
    data.append("request_id", payload.request_id);
    data.append("doctor_id", payload.doctor_id);
    data.append("caretaker_id", payload.caretaker_id);
    data.append("patient_id", payload.patient_id);
    data.append("prescription_type", "test");
    data.append("test_prescription", JSON.stringify(payload.test_name));
    console.warn('params', data)
    axios.post(BASE_URL + API.SAVE_TEST_PRESCRIPTION_API, data, {
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

//=====================Submit Medical Prescription=====================//
export const MedicalSubmitApi = (payload, MedicalPresResponse) => {
    debugger
    let data = new FormData();
    data.append("request_id", payload.request_id);
    data.append("patient_id", payload.patient_id);
    data.append("doctor_id", payload.doctor_id);
    data.append("caretaker_id", payload.caretaker_id);
    data.append("prescription_type", "medicine");
    data.append("medicine_prescription", JSON.stringify(payload.test_name));
    console.log(data)
    axios.post(BASE_URL + API.SAVE_MEDICAL_PRESCRIPTION_API, data, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + payload.token
        }
    }).then((response) => {
        MedicalPresResponse(response.data)
    })
        .catch((error) => {
            MedicalPresResponse(error)
        }).done();
};

////////============================Get Medical Prescrition=========================
export const GetMedicalPrescriptionApi = (payload, TestResponse) => {
    debugger
    
    axios.get(BASE_URL + API.GET_MEDICAL_PRESCRIPTION + payload.id + '&caretaker_id=' + payload.caretaker_id + '&pharmacy_id=' + payload.pharmacy_id, {    
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + payload.token
        }
    }).then((response) => {
        TestResponse(response.data)
    }).catch((error) => {
        TestResponse(error)
    }).done();
};

////////============================Get Test Prescrition=========================
export const GetTestPrescriptionApi = (payload, TestResponse) => {
    
    axios.get(BASE_URL + API.GET_TEST_PRESCRIPTION + payload.id +  '&caretaker_id=' + payload.caretaker_id + '&lab_id=' + payload.lab_id, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + payload.token
        }
    }).then((response) => {
        TestResponse(response.data)
    }).catch((error) => {
        TestResponse(error)
    }).done();
};