//=====================GET CHAT HISTORY API=====================//
import {API, BASE_URL} from "../constants";

export const GetChatHistoryApi = (payload, getChatHistoryApiResponse) => {
    fetch(BASE_URL + API.GET_CHAT_HISTORY + "sender_id=" + payload.sender_id + "&receiver_id=" + payload.receiver_id + "&request_id=" + payload.request_id, {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + payload.token
        }
    })
        .then((response) => response.json())
        .then((responseData) => {
            getChatHistoryApiResponse(responseData)
        })
        .catch((error) => {
            getChatHistoryApiResponse(error)
        }).done();
};
