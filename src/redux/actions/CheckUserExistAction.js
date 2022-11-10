import { API, BASE_URL } from "../constants";
import axios from "axios";

export const CheckUserExistApi = (payload, checkUserExistResponse) => {
  debugger;
  let data = new FormData();
  data.append("email", payload.email);
  data.append("phone_number", Number(payload.phone_number));

  axios
    .post(BASE_URL + API.VERIFY_USER_EXIST_API, data, {
      headers: {},
    })
    .then((response) => {
      checkUserExistResponse(response.data);
    })
    .catch((error) => {
      checkUserExistResponse(error);
    })
    .done();
};
