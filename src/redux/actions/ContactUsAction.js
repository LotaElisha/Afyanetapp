import { API, BASE_URL } from "../constants";
import axios from "axios";

//=====================Contact Us=====================//
export const ContactUsApi = (payload, contactResponse) => {
    let data = new FormData();
    data.append("email", payload.email);
    data.append("name", payload.name);
    data.append("contact_message", payload.contact_message);
    
    axios.post(BASE_URL + API.CONTACT_US_API, data, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + payload.token
        }
    }).then((response) => {
        contactResponse(response.data)
    })
        .catch((error) => {
            contactResponse(error)
        }).done();
};