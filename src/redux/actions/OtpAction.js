import {API, BASE_URL} from "../constants";
import axios from "axios";

//=====================SEND/RESEND OTP=====================//
export const SendOtpApi = (payload, sendOtpResponse) => {
    let data = new FormData();
    data.append("phone_number", payload.phone_number);

    axios.post(BASE_URL + API.SEND_OTP_API, data, {
        headers: {}
    }).then((response) => {
        sendOtpResponse(response.data)
    })
        .catch((error) => {
            sendOtpResponse(error)
        }).done();
};


//=====================VERIFY OTP=====================//
export const VerifyOtpApi = (payload, verifyOtpResponse) => {
    let data = new FormData();
    data.append("phone_number", payload.phone_number);
    data.append("code", payload.code);

    axios.post(BASE_URL + API.VERIFY_OTP_API, data, {
        headers: {}
    }).then((response) => {
        verifyOtpResponse(response)
    })
        .catch((error) => {
            verifyOtpResponse(error)
        }).done();
};
