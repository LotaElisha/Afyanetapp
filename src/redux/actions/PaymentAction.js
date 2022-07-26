import { API, BASE_URL } from "../constants";
import axios from "axios";

//=====================Payment Action=====================//
export const PaymentApi = (payload, paymentResponse) => {
    debugger
    let data = new FormData();
    data.append("receiver_id", payload.receiver_id);
    data.append("sender_id", payload.sender_id);
    data.append("amount", payload.amount);
    data.append("payment_type", payload.payment_type);
    if (payload.request_id !== null && payload.request_id !== undefined)
        data.append("request_id", payload.request_id);
    data.append("payment_for", payload.payment_for);
    axios.post(BASE_URL + API.PAYMENT_API, data, {
        headers: {

        }
    }).then((response) => {
        paymentResponse(response.data)
    })
        .catch((error) => {
            paymentResponse(error)
        }).done();
};

////////============================Payment Order status=========================
export const PaymentOrderStatusApi = (payload, orderStatusResponse) => {
    debugger
    axios.get(BASE_URL + API.GET_PAYMENT_ORDER_STATUS_API + payload.order_id, {
        headers: {
        }
    }).then((response) => {
        orderStatusResponse(response.data)
    }).catch((error) => {
        orderStatusResponse(error)
    }).done();
};

////////============================Get fee for user=========================
export const GetFeeApi = (payload, feeStatusResponse) => {
    debugger
    axios.get(BASE_URL + API.GET_REGISTRATION_FEE_API + payload.user_type, {
        headers: {
        }
    }).then((response) => {
        feeStatusResponse(response.data)
    }).catch((error) => {
        feeStatusResponse(error)
    }).done();
};