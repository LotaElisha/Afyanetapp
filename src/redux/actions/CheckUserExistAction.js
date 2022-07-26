import { API, BASE_URL } from "../constants";
import axios from "axios";

export const CheckUserExistApi = (payload, checkUserExistResponse) => {
    debugger
    let data = new FormData();
    data.append("email", payload.email);
    data.append("phone_number", Number(payload.phone_number));
    if (payload.national_id === undefined && payload.national_id === null)
        data.append("national_id", payload.national_id);
    axios.post(BASE_URL + API.VERIFY_USER_EXIST_API, data, {
        headers: {
        }
    }).then((response) => {
        checkUserExistResponse(response.data)
    })
        .catch((error) => {
            checkUserExistResponse(error)
        }).done();
};
