import { API, BASE_URL } from "../constants";
import axios from "axios";

//=====================Video call Notification=====================//
export const NotificationApi = (payload, notificationResponse) => {
    let data = new FormData();
    data.append("receiver_id", payload.receiver_id);
    data.append("sender_id", payload.sender_id);
    data.append("message", 'video calling ');
    axios.post(BASE_URL + API.VIDEO_CALL_NOTIFICATION, data, {
        headers: {
           
        }
    }).then((response) => {
        notificationResponse(response.data)
    })
        .catch((error) => {
            notificationResponse(error)
        }).done();
};