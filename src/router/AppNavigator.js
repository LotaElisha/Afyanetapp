import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Image, View } from "react-native";
import * as DeviceInfo from "react-native-device-info";
import Animated from 'react-native-reanimated';
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import CancelRequestModal from "../components/cancelRequestModal";
import VideoScreen from "../components/videoCallScreen";
import ForgotPassword from '../screens/common/auth/forgotPassword/ForgotPassword';
import LoginScreen from "../screens/common/auth/loginScreen";
import MedicalDetails from '../screens/common/auth/signUp/medicalDetails';
import VerifyOtpScreen from "../screens/common/auth/signUp/otpVerificationScreen";
import PatientDetails from '../screens/common/auth/signUp/patientDetails';
import RegisterScreen from "../screens/common/auth/signUp/registerScreen";
import ContactUs from '../screens/common/contactUs';
import DocsPreview from '../screens/common/docsViewer';
import GettingStarted from "../screens/common/gettingStarted";
import Notification from '../screens/common/notification';
import PaymentHistory from '../screens/common/paymentHistory';
import PaymentScreen from '../screens/common/paymentScreen';
import WebPaymentScreen from '../screens/common/paymentScreen/webPayment';
import Preview from '../screens/common/preview';
import SettingsScreen from '../screens/common/settings';
import Terms from '../screens/common/TermCondition';
import ActiveConsultation from '../screens/doctorModule/activeConsultations';
import CancelledConsultation from '../screens/doctorModule/cancelledConsultations';
import ConsultationHistoryDetails from '../screens/doctorModule/consultationHistoryDetails';
import ConsultationRequest from '../screens/doctorModule/consultationRequest';
import ConsultationScreen from '../screens/doctorModule/consultationScreen';
import DoctorDetail from '../screens/doctorModule/doctorDetails';
//patient history
import DoctorHistory from "../screens/doctorModule/doctorHistory";
import DoctorHomeScreen from "../screens/doctorModule/doctorHome";
import DoctorPaymentScreen from "../screens/doctorModule/doctorPaymentScreen";
import MedicalPres from '../screens/doctorModule/medicalPrescription';
import MyAccountDoctor from "../screens/doctorModule/myAccountDoctor";
import DoctorProfile from '../screens/doctorModule/myAccountDoctor/viewProfile';
import NewRequestScreen from '../screens/doctorModule/newRequests/index';
import ReviewMember from '../screens/doctorModule/reviewDetails';
import TestPres from '../screens/doctorModule/testPrescription';
import ViewPrescription from '../screens/doctorModule/viewPrescription';
import DoctorsCustomDrawerContent from "../screens/drawer/doctorDrawer";
import PatientCustomDrawerContent from "../screens/drawer/patientDrawer";
import ConsultationsHistory from '../screens/patientModule/consultationHistory';
import EditAndAddPatient from '../screens/patientModule/editPatientAndAddPatient/EditAndAddPatient';
import GeneralDoctorsListing from "../screens/patientModule/generalDoctors";
import HistoryDetails from "../screens/patientModule/historyDetail";
import LabDetails from '../screens/patientModule/labsDetails';
import Laboratories from "../screens/patientModule/labTests";
import MyAccountPatient from "../screens/patientModule/myAccountPatient";
import PatientHomeScreen from "../screens/patientModule/patientHome";
import RatingModal from '../screens/patientModule/patientHome/ratingModel';
import PatientPaymentScreen from '../screens/patientModule/patientPaymentScreen';
import PatientsListing from "../screens/patientModule/patients";
import PharmacyDetails from "../screens/patientModule/pharmacyDetails";
import PharmacyListing from "../screens/patientModule/pharmacys";
import SplDoctor from '../screens/patientModule/specializedDoctors';
import StartConsultation from "../screens/patientModule/startConsltation";
import COLORS from "../themes/Colors";
import { PATIENT_TAB_ICONS } from "../utils/ImagePaths";



const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();


//==============================================================================//
//============================PATIENT'S NAVIGATORS==============================//
//==============================================================================//
const PatientDrawerNavigator = () => {
    const [progress, setProgress] = React.useState(new Animated.Value(0));
    const scale = Animated.interpolate(progress, {
        inputRange: [0, 1],
        outputRange: [1, 0.8]
    });
    const borderRadius = Animated.interpolate(progress, {
        inputRange: [0, 1],
        outputRange: [0, 40]
    });
    const screenStyle = { borderRadius, transform: [{ scale }] };
    return (
        <View style={{ flex: 1, backgroundColor: COLORS.TRANSPARENT }}>
            <Drawer.Navigator
                drawerType={'slide'}
                overlayColor={COLORS.TRANSPARENT}
                drawerStyle={{
                    width: wp(62),
                    backgroundColor: COLORS.APP_THEME_COLOR
                }}
                drawerContentOption={{
                    activeBackgroundColor: COLORS.TRANSPARENT,
                }}
                sceneContainerStyle={{ backgroundColor: COLORS.APP_THEME_COLOR }}
                drawerContent={props => {
                    setProgress(props.progress);
                    return <PatientCustomDrawerContent {...props} />
                }}
                initialRouteName="Screens">
                <Drawer.Screen name="Screens">
                    {props => <PatientDrawerScreens {...props} style={screenStyle} />}
                </Drawer.Screen>
            </Drawer.Navigator>
        </View>
    )
};

const PatientDrawerScreens = ({ style }) => {
    return (
        <Animated.View style={[{ flex: 1, overflow: 'hidden' }, style]}>
            <Stack.Navigator initialRouteName="PatientTab" headerMode="none">
                <Stack.Screen name="PatientTab" component={TabNavigator} />
                <Stack.Screen name="PatientsListing" component={PatientsListing} />
                <Stack.Screen name="MyAccountPatient" component={MyAccountPatient} />
                <Stack.Screen name="PatientConsultationsHistory" component={ConsultationsHistory} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="ContactUs" component={ContactUs} />
                <Stack.Screen name="Notification" component={Notification} />
                <Stack.Screen name="EditAndAddPatient" component={EditAndAddPatient} />
            </Stack.Navigator>
        </Animated.View>
    )
};


const TabNavigator = ({ }) => {
    return (
        <Tab.Navigator
            initialRouteName={"PatientHomeScreen"}
            backBehavior={"initialRoute"}
            tabBarOptions={{
                showLabel: false,
                tabStyle: {
                    height: wp("15%"),
                },
                style: {
                    height: DeviceInfo.hasNotch() ? wp("19%") : wp("15%"),
                    backgroundColor: COLORS.WHITE_COLOR_SHADE,
                }
            }}
        >
            <Tab.Screen
                name="SpecializedDoctors"
                component={SplDoctor}
                options={navigation => ({
                    unmountOnBlur: true,
                    tabBarIcon: ({ color, focused }) => {
                        if (focused) {
                            return (
                                <View style={{
                                    height: wp("13%"),
                                    width: wp("13%"),
                                    borderRadius: wp("4%"),
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: COLORS.APP_THEME_COLOR
                                }}>
                                    <Image source={PATIENT_TAB_ICONS.ACTIVE_GENERAL_DOCTOR_ICON} />
                                </View>
                            )
                        } else {
                            return (
                                <Image source={PATIENT_TAB_ICONS.INACTIVE_GENERAL_DOCTOR_ICON} />
                            )
                        }
                    }
                })
                }
            />
            <Tab.Screen
                name="GeneralDoctors"
                component={GeneralDoctorsListing}
                options={{
                    tabBarIcon: ({ color, focused }) => {
                        if (focused) {
                            return (
                                <View style={{
                                    height: wp("13%"),
                                    width: wp("13%"),
                                    borderRadius: wp("4%"),
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: COLORS.APP_THEME_COLOR
                                }}>
                                    <Image source={PATIENT_TAB_ICONS.ACTIVE_SPECIALIZED_DOCTOR_ICON} />
                                </View>
                            )
                        } else {
                            return (
                                <Image source={PATIENT_TAB_ICONS.INACTIVE_SPECIALIZED_DOCTOR_ICON} />
                            )
                        }
                    }
                }}
            />

            <Tab.Screen
                name="PatientHomeScreen"
                component={PatientHomeScreen}
                options={navigation => ({
                    unmountOnBlur: true,
                    tabBarIcon: ({ color, focused }) => {
                        if (focused) {
                            return (
                                <View style={{
                                    height: wp("13%"),
                                    width: wp("13%"),
                                    borderRadius: wp("4%"),
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: COLORS.APP_THEME_COLOR
                                }}>
                                    <Image source={PATIENT_TAB_ICONS.ACTIVE_HOME_ICON} />
                                </View>
                            )
                        } else {
                            return (
                                <Image source={PATIENT_TAB_ICONS.INACTIVE_HOME_ICON} />
                            )
                        }
                    }
                })
                }
            />

            <Tab.Screen
                name="Labs"
                component={Laboratories}
                options={{
                    tabBarIcon: ({ color, focused }) => {
                        if (focused) {
                            return (
                                <View style={{
                                    height: wp("13%"),
                                    width: wp("13%"),
                                    borderRadius: wp("4%"),
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: COLORS.APP_THEME_COLOR
                                }}>
                                    <Image source={PATIENT_TAB_ICONS.ACTIVE_LAB_TEST_ICON} />
                                </View>
                            )
                        } else {
                            return (
                                <Image source={PATIENT_TAB_ICONS.INACTIVE_LAB_TEST_ICON} />
                            )
                        }
                    }
                }}
            />
            <Tab.Screen
                name="Pharmacy"
                component={PharmacyListing}
                options={{
                    tabBarIcon: ({ color, focused }) => {
                        if (focused) {
                            return (
                                <View style={{
                                    height: wp("13%"),
                                    width: wp("13%"),
                                    borderRadius: wp("4%"),
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: COLORS.APP_THEME_COLOR
                                }}>
                                    <Image source={PATIENT_TAB_ICONS.ACTIVE_PHARMACY_ICON} />
                                </View>
                            )
                        } else {
                            return (
                                <Image source={PATIENT_TAB_ICONS.INACTIVE_PHARMACY_ICON} />
                            )
                        }
                    }
                }}
            />
        </Tab.Navigator>
    )
};



//==============================================================================//
//=============================DOCTOR'S NAVIGATORS==============================//
//==============================================================================//
const DoctorDrawerNavigator = () => {
    const [progress, setProgress] = React.useState(new Animated.Value(0));
    const scale = Animated.interpolate(progress, {
        inputRange: [0, 1],
        outputRange: [1, 0.8]
    });
    const borderRadius = Animated.interpolate(progress, {
        inputRange: [0, 1],
        outputRange: [0, 40]
    });
    const screenStyle = { borderRadius, transform: [{ scale }] };
    return (
        <View style={{ flex: 1, backgroundColor: COLORS.TRANSPARENT }}>
            <Drawer.Navigator
                drawerType={'slide'}
                overlayColor={COLORS.TRANSPARENT}
                drawerStyle={{
                    width: wp(62),
                    backgroundColor: COLORS.APP_THEME_COLOR
                }}
                drawerContentOption={{
                    activeBackgroundColor: COLORS.TRANSPARENT,
                }}
                sceneContainerStyle={{ backgroundColor: COLORS.APP_THEME_COLOR }}
                drawerContent={props => {
                    setProgress(props.progress);
                    return <DoctorsCustomDrawerContent {...props} />
                }}
                initialRouteName="Home">
                <Drawer.Screen name="Screens">
                    {props => <DoctorDrawerScreens {...props} style={screenStyle} />}
                </Drawer.Screen>
            </Drawer.Navigator>
        </View>
    )
};

const DoctorDrawerScreens = ({ style }) => {
    return (
        <Animated.View style={[{ flex: 1, overflow: 'hidden' }, style]}>
            <Stack.Navigator initialRouteName="DoctorHomeScreen" headerMode="none">
                <Stack.Screen name="DoctorHomeScreen" component={DoctorHomeScreen} />
                <Stack.Screen name="NewRequest" component={NewRequestScreen} />
                <Stack.Screen name="MyAccountDoctor" component={MyAccountDoctor} />
                <Stack.Screen name="DoctorHistory" component={DoctorHistory} />
                <Stack.Screen name="CancelledConsultation" component={CancelledConsultation} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="ContactUs" component={ContactUs} />
                <Stack.Screen name="ReviewMember" component={ReviewMember} />
                <Stack.Screen name="ActiveConsultation" component={ActiveConsultation} />
                <Stack.Screen name="Notification" component={Notification} />
            </Stack.Navigator>
        </Animated.View>
    )
};


//==============================================================================//
//===============================MAIN NAVIGATOR=================================//
//==============================================================================//
const Navigator = () => {
    return (
        <Stack.Navigator initialRouteName="GettingStarted" mode="modal" headerMode="none">
            <Stack.Screen name="GettingStarted" component={GettingStarted} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            <Stack.Screen name="VerifyOtpScreen" component={VerifyOtpScreen} />
            <Stack.Screen name="PatientDetailsScreen" component={PatientDetails} />
            <Stack.Screen name="MedicalDetails" component={MedicalDetails} />
            <Stack.Screen name="DoctorPaymentScreen" component={DoctorPaymentScreen} />
            <Stack.Screen name="PatientPaymentScreen" component={PatientPaymentScreen} />
            <Stack.Screen name="PatientDrawer" component={PatientDrawerNavigator} />
            <Stack.Screen name="DoctorDrawer" component={DoctorDrawerNavigator} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="SplDoc" component={SplDoctor} />
            <Stack.Screen name="DoctorDetail" component={DoctorDetail} />
            <Stack.Screen name="ConsultationScreen" component={ConsultationRequest} />
            <Stack.Screen name="startConsultation" component={StartConsultation} />
            <Stack.Screen name="CancelRequestModal" component={CancelRequestModal} />
            <Stack.Screen name="VideoScreen" component={VideoScreen} />
            <Stack.Screen name="PharmacyDetails" component={PharmacyDetails} />
            <Stack.Screen name="ConsultationChatScreen" component={ConsultationScreen} />
            <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
            <Stack.Screen name="PaymentWeb" component={WebPaymentScreen} />
            <Stack.Screen name="doctorProfile" component={DoctorProfile} />
            <Stack.Screen name="TestPrescription" component={TestPres} />
            <Stack.Screen name="MedicalPrescription" component={MedicalPres} />
            <Stack.Screen name="LabDetails" component={LabDetails} />
            <Stack.Screen name="RatingModal" component={RatingModal} />
            <Stack.Screen name="PaymentHistory" component={PaymentHistory} />
            <Stack.Screen name="TermsConditions" component={Terms} />
            <Stack.Screen name="ViewPrescription" component={ViewPrescription} />
            <Stack.Screen name="ConsultationHistoryDetails" component={ConsultationHistoryDetails} />
            <Stack.Screen name="HistoryDetails" component={HistoryDetails} />
            <Stack.Screen name="Preview" component={Preview} />
            <Stack.Screen name="Docsviewer" component={DocsPreview} />
        </Stack.Navigator>
    )
};


export default Navigator
