import {Platform} from 'react-native';


//=============================BASE URL===================================//
// module.exports.BASE_URL = "http://52.14.207.105/api/";
module.exports.BASE_URL = "https://afyanetwork.com/api/";
module.exports.IMAGE_BASE_URL = "https://afyanetwork.com";//"http://52.14.207.105";


//============================DEVICE TYPE==================================//
// export const DEVICE_TYPE = Platform.OS === 'ios' ? "Iphone" : "Android";
export const DEVICE_TYPE = Platform.OS === 'ios' ? "IOS" : "Android";

//===========================API END POINTS=================================//
export const API = {
    SIMPLE_LOGIN_API: "login",
    SOCIAL_LOGIN_API: "social-login",
    FORGOT_PASSWORD: 'forget-password',
    LOGOUT_API: "logout",
    VERIFY_USER_EXIST_API: "verify-user",
    SEND_OTP_API: "send-sms",
    VERIFY_OTP_API: "verify-user-otp",
    REGISTER_API: "register",
    REGISTER_PATIENT_DETAILS_API: "patient-sign-up",
    REGISTER_DOCTOR_DETAILS_API: "doctor-sign-up",
    GET_PHARMACY_API: "search-pharmacy?pharmacy_name=",
    GET_LABS_API: "search-labs?lab_name=",
    GET_GENERAL_DOCTOR_API: 'general-doctor-search?doctor_type=General Physician&doctor_name=',
    GET_DOCTOR_STATUS_API: "doctor-status?id=",
    CHANGE_DOCTOR_STATUS_API: "change-status",
    GET_DOCTOR_SPECIALIZATION_SEARCH_LIST_API: "specialized-doctor-search?specialization=",
    ACTIVE_PATIENT_CONSULTATION_API: 'patient-active-consultations?caretaker_id=',
    PREVOIUS_PATIENT_CONSULTATION_API: 'patient-previous-consultations?caretaker_id=',
    START_CONSLTATION_REQUEST_API: 'create-patient-for-doctor',
    GET_DOCTOR_CONSULTATION_REQUESTS_API: "doctor-requests?doctor_id=",
    GET_DOCTOR_ACTIVE_CONSULTATIONS_API: "doctor-active-consultations?doctor_id=",
    GET_CONSULTATION_REQUEST_DETAILS_API: "patient-consultation-detail?request_id=",
    CHANGE_CONSULTATION_REQUEST_STATUS_API: "update-patient-request-status",
    DOCTOR_DETAILS_API: "doctor-detail?id=",
    GET_PHARMACY_DETAILS: "pharmacy-detail?pharmacy_id=",
    GET_ALL_DOCTORS_LIST: "all-doctor-list",
    GET_CHAT_HISTORY: "get-chat-history?",
    SAVE_CONNECTY_CUBE_DATA: "save-connect-cube-data",
    DOCTOR_COMPLETED_HISTORY_CONSULTATION: 'doctor-completed-history-consultations?doctor_id=',
    CHANGE_PASSWORD_API:'user-password-update',
    GET_USER_PROFILE_API:'user-profile?user_id=',
    UPDATE_USER_PROFILE_API:'update-user-profile',
    // patient history
    PATIENT_HISTORY_LIST_API:'request-history-list?caretaker_id=',
    PATIENT_LAB_HISTORY_LIST_API:'lab-request-history-list?caretaker_id=',
    PATIENT_PHARMACY_HISTORY_LIST_API:'pharmacy-request-history-list?caretaker_id=',

    CONTACT_US_API:'contact-us',
    END_CONSULTATION_API:'end-consultation',
    // GET_TEST_LIST_API:'get-test-name-by-doctor',
    GET_TEST_LIST_API:'get-all-test-list',
    SAVE_TEST_PRESCRIPTION_API:'save-test-prescription',
    SAVE_MEDICAL_PRESCRIPTION_API:'save-medicine-prescription',
    DR_CONSULTATION_HISTORY_BY_STATUS:'doctor-consultation-history-by-status?doctor_id=', 
    GET_LABS_DETAILS: "lab-detail?lab_id=",
    USER_REVIEW:'user-reviews',
    GET_PATIENT:'get-patient-under-caretaker?caretaker_id=',
    DELETE_PATIENT:'delete-patient-under-caretaker?patient_id=',
    GET_TEST_PRESCRIPTION:'get-test-prescription?prescription_id=',
    GET_MEDICAL_PRESCRIPTION:'get-medicine-prescription?prescription_id=',
    UPDATE_PATIENT_DETAIL:'edit-patient-under-caretaker',
    SAVE_USER_RATING:'save-user-rating',
    GET_NOTIFICATION_HISTORY:'get-notification-history?user_id=',
    ORDER_TEST_TO_LAB:'lab-order-detail',
    ORDER_MEDICINE_TO_PHARMACY:'pharmacy-order-detail',
    VIDEO_CALL_NOTIFICATION:'App/SendVideoCallNotification',
    PAYMENT_API:'selcomPayment',
    GET_PATIENT_PAYMENT_HISTORY_API:'send-payment-history',
    GET_DOCTOR_PAYMENT_HISTORY_API:'receiver-payment-history',
    GET_PAYMENT_ORDER_STATUS_API:'getStatus/',
    PRIVACY_POLICY:'http://52.14.207.105/PrivacyPolicy',
    TERMS_AND_CONDITIONS:'http://52.14.207.105/TermsAndConditions',
    GET_REGISTRATION_FEE_API:'get-payable-amount?user_type=',
    GET_ACTIVE_CONSULTATION_DETAIL:'active-consultations-detail?consultation_id='
};
