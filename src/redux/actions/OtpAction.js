import { API, BASE_URL } from "../constants";
import axios from "axios";

//=====================SEND/RESEND OTP=====================//
export const SendOtpApi = (payload, sendOtpResponse) => {
  let data = new FormData();
  data.append("phone_number", payload.phone_number);

  axios
    .post(BASE_URL + API.SEND_OTP_API, data, {
      headers: {},
    })
    .then((response) => {
      console.log("response1", response);
      sendOtpResponse(response.data);
    })
    .catch((error) => {
      console.log("error1", error);
      sendOtpResponse(error);
    })
    .done();
};

//=====================VERIFY OTP=====================//
export const VerifyOtpApi = (payload, verifyOtpResponse) => {
  let data = new FormData();
  data.append("phone_number", payload.phone_number);
  data.append("code", payload.code);

  axios
    .post(BASE_URL + API.VERIFY_OTP_API, data, {
      headers: {},
    })
    .then((response) => {
      console.log("response2", response);
      verifyOtpResponse(response);
    })
    .catch((error) => {
      console.log("error2", error);
      verifyOtpResponse(error);
    })
    .done();
};
