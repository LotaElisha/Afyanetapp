//=====================SAVE CONNECTY CUBE DATA API=====================//
import {API, BASE_URL} from "../constants";
import axios from "axios";

export const SaveConnectCubeDataApi = (payload, saveConnectCubeDataApiResponse) => {
    let data = new FormData();
    debugger
    data.append("user_id", payload.user_id);
    data.append("connect_cube_id", payload.connect_cube_id);
    data.append("name", payload.name);
    data.append("password", "Mind@123");

    console.warn("payload", data)

    axios.post(BASE_URL + API.SAVE_CONNECTY_CUBE_DATA, data, {
        headers: {

        }
    }).then((response) => {
        console.warn("result", response)
        saveConnectCubeDataApiResponse(response.data)
    })
        .catch((error) => {
            console.warn("result", error)
            saveConnectCubeDataApiResponse(error)
        }).done();
};
