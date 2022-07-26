import {API, BASE_URL} from "../constants";
import axios from "axios";

export const PatientRating = (payload, ratingResponse) => {
    debugger
    let data = new FormData();
    data.append("rated_by_user_id", payload.user_id);
    data.append("rating_for",'doctor');
    data.append("comment", payload.comment);
    data.append("rated_for_user_id", payload.doctor_id);
    data.append("rating", payload.rating);
    data.append("request_id", payload.request_id);


    axios.post(BASE_URL + API.SAVE_USER_RATING, data,{
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + payload.token
        }
    }).then((response) => {
        ratingResponse(response.data)
        })
        .catch((error) => {
            ratingResponse(error)
        }).done();
};
