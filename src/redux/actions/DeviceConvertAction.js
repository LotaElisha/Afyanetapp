import axios from "axios";

export const GetFcmToken = (payload, getResponse) => {

    axios.post("https://iid.googleapis.com/iid/v1:batchImport", JSON.stringify({
        "application": "com.afyanet.health",
        "sandbox":true,
        "apns_tokens":[payload.token]
    }), {
        headers:
            {
                'Content-Type': "application/json",
                'Authorization': "key=AAAAaPJWaQg:APA91bGoypWayiT0pWBWajsyFwEFuRt_aai5Nx2jfMYf7ulzBVlTny9le7p7Ip3Pa-kaXiClIGK_N4a-AkVFR_VdcONa6_hoMcGg53OP25nGQdFztO8fFwWsMIUhdeP5xBtMtQyOXUh-",
            },
    })
        .then((response) => {
            getResponse(response.data);
        })
        .catch((error) => {
            getResponse(error);
        }).done();
};