import React from "react";
import OtpInputs from "react-native-otp-inputs";
import AntDesign from "react-native-vector-icons/AntDesign";
import {Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, View} from "react-native";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";

import BaseClass from "../../../../../utils/BaseClass";
import {
    MainContainer,
    SafeAreaViewContainer,
    ScrollContainer,
    ShadowViewContainer
} from "../../../../../utils/BaseStyles";
import {DescriptionText, TitleText, ResendText} from "./styles";
import {AbsoluteContainer, CardContainerStyle} from "../../authComponents/styles";
import COLORS from "../../../../../themes/Colors";
import {Spacer} from "../../../../../components/spacer";
import STRINGS from "../../../../../utils/Strings";
import {FONT_FAMILY} from "../../../../../themes/FontFamilies";
import {FONT} from "../../../../../themes/FontSizes";
import {AppIconImageComponent, CurvedImageBackground, FillInfoTextComponent} from "../../authComponents";
import {NewPrimaryButton} from "../../../../../components/buttons/primaryButton";
import {SendOtpApi, VerifyOtpApi} from "../../../../../redux/actions/OtpAction";
import {RegisterApi} from "../../../../../redux/actions/SignUpAction";
import {SaveConnectCubeDataApi} from "../../../../../redux/actions/saveConnectycubeDataAction";
import OrientationLoadingOverlay from "../../../../../utils/CustomLoader";
import {CommonActions} from "@react-navigation/native";
import {ConnectycubeAuthServices} from "../../../../../utils/services";
import ConnectyCube from "react-native-connectycube";

export default class VerifyOtpScreen extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            otp: "",
            isLoading: false
        };
        ConnectyCube.createSession()
            .then((session) => {
            })
            .catch((error) => {
            });
    }


    onResendOtp = () => {
        const {formattedPhoneNumber} = this.props.route.params;
        if (this.isConnected()) {
            this.showDialog();
            SendOtpApi({
                phone_number: formattedPhoneNumber
            }, response => this.handleReSendOtpResponse(response))
        } else {
            this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
        }
    };


    onSubmitPress = () => {
        const {formattedPhoneNumber} = this.props.route.params;
        const {otp} = this.state;
        if (otp.length === 0) {
            this.showToastAlert(STRINGS.EMPTY_OTP)
        } else if (otp.length !== 6) {
            this.showToastAlert(STRINGS.COMPLETE_OTP)
        } else if (this.isConnected()) {
            this.showDialog();
            VerifyOtpApi({
                phone_number: formattedPhoneNumber,
                code: otp
            }, response => this.handleVerifyOtpResponse(response))
        } else {
            this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
        }
    };


    handleVerifyOtpResponse = (response) => {
        const {registerPayload} = this.props.route.params;
        if (response !== undefined && response !== null) {
            if (response.data.code === 200) {
                RegisterApi({
                    registerPayload
                }, response => this.handleRegisterResponse(response))
            } else if (response.data.code === 204) {
                this.hideDialog()
                this.showToastAlert(response.message);
            } else if (response.data.code === 400) {
                this.hideDialog()
                this.showToastAlert(STRINGS.INVALID_OTP);
            } else if (response.data.code === 401) {
                this.hideDialog()
                this.showToastAlert(response.message);
            } else if (response.data.code === 500) {
                this.hideDialog()
                this.showToastAlert(STRINGS.SERVER_ERROR);
            } else {
                this.hideDialog()
                this.showToastAlert(STRINGS.UNKNOWN_ERROR);
            }
        } else {
            this.showToastAlert(STRINGS.UNKNOWN_ERROR);
            this.hideDialog()
        }
    };

    handleConnectyCubeData = (response, userType, data) => {
        const {navigation, route} = this.props;
        const {registerPayload} = route.params;
        const {navigate} = navigation;
        if (response !== undefined && response !== null) {
            this.hideDialog()
            if (response.code === 200) {
                this.showToastSucess(STRINGS.OTP_VERIFIED_SUCCESSFULLY);
                if (userType === "patient" || userType === "caretaker") {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 1,
                            routes: [
                                {
                                    name: "LoginScreen"
                                },
                                {
                                    name: 'PatientDetailsScreen',
                                    params: {data: data}
                                },
                            ],
                        })
                    )
                } else if (userType === "doctor") {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 1,
                            routes: [
                                {
                                    name: "LoginScreen"
                                },
                                {
                                    name: 'MedicalDetails',
                                    params: {data: data}
                                },
                            ],
                        })
                    )
                }
            } else if (response.code === 204) {
                this.showToastAlert(response.message);
            } else if (response.code === 400) {
                this.showToastAlert(response.message);
            } else if (response.code === 401) {
                this.showToastAlert(response.message);
            } else if (response.code === 500) {
                this.showToastAlert(STRINGS.SERVER_ERROR);
            } else {
                this.showToastAlert(STRINGS.UNKNOWN_ERROR);
            }
        } else {
            this.showToastAlert(STRINGS.UNKNOWN_ERROR);
            this.hideDialog()
        }
    }

    handleRegisterResponse = (response) => {
        debugger
        const {navigation, route} = this.props;
        const {registerPayload} = route.params;
        const {navigate} = navigation;
        if (response !== undefined && response !== null) {
            this.hideDialog()
            if (response.code === 200) {
                const userProfile = {
                    password: "Mind@123",
                    email: registerPayload.email,
                    full_name: registerPayload.first_name + " " + registerPayload.last_name,
                };
                ConnectyCube.users
                    .signup(userProfile)
                    .then((user) => {
                        SaveConnectCubeDataApi({
                            user_id: response.data.id,
                            connect_cube_id: user.user.id,
                            name: registerPayload.first_name + " " + registerPayload.last_name,
                            password: "Mind@123"
                        }, res => this.handleConnectyCubeData(res, response.data.user_type.toLowerCase(), response.data))
                    })
                    .catch((error) => {
                        console.warn("error", error)
                    });
            } else if (response.code === 204) {
                this.showToastAlert(response.message);
            } else if (response.code === 400) {
                this.showToastAlert(response.message);
            } else if (response.code === 401) {
                this.showToastAlert(response.message);
            } else if (response.code === 500) {
                this.showToastAlert(STRINGS.SERVER_ERROR);
            } else {
                this.showToastAlert(STRINGS.UNKNOWN_ERROR);
            }
        } else {
            this.showToastAlert(STRINGS.UNKNOWN_ERROR);
            this.hideDialog()
        }
    };


    handleReSendOtpResponse = (response) => {
        if (response !== undefined && response !== null) {
            this.hideDialog();
            if (response.body !== undefined) {
                this.showToastSucess(STRINGS.OTP_SENT_SUCCESSFULLY);
            } else if (response.code === 204) {
                this.showToastAlert(response.message);
            } else if (response.code === 400) {
                this.showToastAlert(response.message);
            } else if (response.code === 401) {
                this.showToastAlert(response.message);
            } else if (response.code === 500) {
                this.showToastAlert(STRINGS.SERVER_ERROR);
            } else {
                this.showToastAlert(STRINGS.UNKNOWN_ERROR);
            }
        } else {
            this.showToastAlert(STRINGS.UNKNOWN_ERROR);
            this.hideDialog();
        }
    };


    _renderCardView = () => {
        return (
            <CardContainerStyle>
                <TitleText>{STRINGS.VERIFY_DETAILS_TEXT}</TitleText>
                <Spacer space={2.5}/>
                <DescriptionText>Please enter the<DescriptionText
                    style={{
                        color: COLORS.APP_THEME_COLOR,
                        fontFamily: FONT_FAMILY.MontserratSemiBold
                    }}> OTP </DescriptionText>shared on your mobile number
                    below</DescriptionText>
                <Spacer space={5}/>
                <OtpInputs
                    clearTextOnFocus
                    handleChange={(code) => this.setState({otp: code})}
                    keyboardType="phone-pad"
                    numberOfInputs={6}
                    inputContainerStyles={{
                        height: wp("15%"),
                        paddingHorizontal: wp(".5%"),
                        borderWidth: 1,
                        borderRadius: wp("3%"),
                        borderBottomWidth: 1,
                        borderColor: "#DCDCDC",
                        width: wp('10%'),
                        alignContent: 'center',
                        alignItems: "center",
                        justifyContent: "center",
                        marginHorizontal: wp("1.5%")
                    }}
                    inputStyles={{
                        textAlign: 'center',
                        fontSize: FONT.TextMediumX,
                        fontFamily: FONT_FAMILY.MontserratRegular
                    }}
                    selectTextOnFocus={false}
                    autofillFromClipboard={false}
                />
                <Spacer space={5}/>
                <ShadowViewContainer style={{borderRadius: wp("8%")}}>
                    <NewPrimaryButton
                        btnText={STRINGS.SUBMIT_TEXT}
                        width={56}
                        borderRadius={wp("8%")}
                        verticalPaddingWithText={4}
                        isTextBold={true}
                        onPress={() => this.onSubmitPress()}
                    />
                </ShadowViewContainer>
                <Spacer space={.5}/>
            </CardContainerStyle>
        )
    };

    _renderCustomLoader = () => {
        const {isLoading} = this.state;
        return (
            <OrientationLoadingOverlay visible={isLoading} message="Loading.."/>
        )
    };

    render() {
        const {navigation} = this.props;
        return (
            <SafeAreaViewContainer>
                <KeyboardAvoidingView
                    style={{flex: 1, backgroundColor: COLORS.APP_BACKGROUND_COLOR}}
                    behavior={(Platform.OS === 'ios') ? 'padding' : null}>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            Keyboard.dismiss()
                        }}>
                        <ScrollContainer keyboardShouldPersistTaps={"handled"}>
                            <MainContainer>
                                <CurvedImageBackground/>
                                <AbsoluteContainer>
                                    <View style={{width: wp("90%")}}>
                                        <AntDesign
                                            name={"arrowleft"}
                                            color={COLORS.WHITE_COLOR}
                                            size={30}
                                            onPress={() => navigation.pop()}
                                        />
                                    </View>
                                    <Spacer space={10}/>
                                    <AppIconImageComponent/>
                                    <FillInfoTextComponent/>
                                    <Spacer space={4}/>
                                    {this._renderCardView()}
                                    <Spacer space={8}/>
                                    <ResendText
                                        onPress={() => this.onResendOtp()}>{STRINGS.RESEND_OTP_TEXT}</ResendText>
                                </AbsoluteContainer>
                                <Spacer space={4}/>
                            </MainContainer>
                            {this._renderCustomLoader()}
                        </ScrollContainer>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </SafeAreaViewContainer>
        )
    }
}
