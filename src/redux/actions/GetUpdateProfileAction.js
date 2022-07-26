import { API, BASE_URL } from "../constants";
import axios from "axios";
import {Platform } from "react-native";


//=====================GET Profile API=====================//
export const GetProfileApi = (payload, profileResponse) => {
    axios.get(BASE_URL + API.GET_USER_PROFILE_API + payload.id, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + payload.token
        }
    }).then((response) => {
        profileResponse(response.data)
    }).catch((error) => {
        profileResponse(error)
    }).done();
};

//=====================Update PROFILE=====================//
export const UpdateProfileApi = (payload, profileResponse) => {
    debugger
    let data = new FormData();
    data.append("user_id", payload.id);
    data.append("first_name", payload.first_name);
    data.append("last_name", payload.last_name);
    data.append("email", payload.email);
    data.append("phone_number", payload.phone_number);
    if (payload.alternative_number !== undefined && payload.alternative_number !== null)
        data.append("alternative_number", payload.alternative_number);
    if (payload.national_id !== null && payload.national_id !== undefined)
        data.append("national_id", payload.national_id);
    if (payload.house_number !== undefined && payload.house_number !== null)
        data.append("house_number", payload.house_number);
    data.append("street_name", payload.street_name);
    if (payload.ward_name !== undefined && payload.ward_name !== null)
        data.append("ward_name", payload.ward_name);
    data.append("district", payload.district);
    data.append("region", payload.region);
    if (payload.profile_pic !== undefined && payload.profile_pic !== null)
        data.append("profile_image", {
            uri: Platform.OS === 'ios' ? payload.profile_pic.path.replace("file://", "/private") : payload.profile_pic.path,
            name: (payload.profile_pic.filename !== undefined && payload.profile_pic.filename !== null)
                ? payload.timestamp + "profile_pic" + payload.profile_pic.filename
                : payload.timestamp + "profile_pic" + ".JPEG",
            type: payload.profile_pic.mime
        }
        );
    console.log(data)
    axios.post(BASE_URL + API.UPDATE_USER_PROFILE_API, data, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + payload.token
        }
    }).then((response) => {
        profileResponse(response.data)
    })
        .catch((error) => {
            profileResponse(error)
        }).done();
};