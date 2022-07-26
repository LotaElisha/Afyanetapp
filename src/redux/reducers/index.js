import {combineReducers} from "redux";
import {SimpleLoginReducer, SocialLoginReducer} from "./LoginReducer";
import ForgotPasswordReducer from './ForgotPasswordReducer'
import LogoutReducer from "./LogoutReducer";
import LabsReducer from './GetLabsReducer'
import PharmacyReducer from './GetPharmacyReducer'
import GenDoctorReducer from './GeneralDoctorReducer'
import SpecializationReducer from './SpecializedDocReducer'
import { ActiveConsltationReducer,PreviousConsltationReducer} from './PatientHomeReducer'
import StartConsultationReducer from './StartConsultationReducer'
import GetAllDoctorReducer from './GetAllDoctorReducer'
import ChangePasswordReducer from './ChangePasswordReducer'

const rootReducer = (state, action) => {
    if (action.type === "LOGOUT_SUCCESS") {
        state = undefined
    }
    return appReducer(state, action)
};

const appReducer = combineReducers({
    SimpleLoginReducer,
    SocialLoginReducer,
    ForgotPasswordReducer,
    LogoutReducer,
    LabsReducer,
    PharmacyReducer,
    GenDoctorReducer,
    SpecializationReducer,
    ActiveConsltationReducer,
    PreviousConsltationReducer,
    StartConsultationReducer,
    GetAllDoctorReducer,
    ChangePasswordReducer
});
export default rootReducer;
