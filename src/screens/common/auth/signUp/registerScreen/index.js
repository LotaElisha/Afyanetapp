import React from "react";
import { Image, Keyboard, KeyboardAvoidingView, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Input } from "react-native-elements";
import DropDownPicker from 'react-native-dropdown-picker';

import BaseClass from "../../../../../utils/BaseClass";
import COLORS from "../../../../../themes/Colors";
import { Spacer } from "../../../../../components/spacer";
import STRINGS from "../../../../../utils/Strings";
import {
    AppIconImageComponent,
    CurvedImageBackground,
    FillInfoTextComponent,
    TextInputHeadingComponent
} from "../../authComponents";
import { NewPrimaryButton } from "../../../../../components/buttons/primaryButton";
import { FONT } from "../../../../../themes/FontSizes";
import { FONT_FAMILY } from "../../../../../themes/FontFamilies";
import { AUTH_IMAGES } from "../../../../../utils/ImagePaths";
import { AbsoluteContainer, CardContainerStyle, CardHeadingStyle } from "../../authComponents/styles";
import {
    MainContainer,
    SafeAreaViewContainer,
    ScrollContainer,
    ShadowViewContainer
} from "../../../../../utils/BaseStyles";
import { validateEmail, validatePassword } from "../../../../../utils/validations";
import PhoneInput from "../../../../../../local_modules/react-native-phone-input";
import AutoCompleteComponent from "../../../../../components/googlePlacesAutoComplete";
import { CheckUserExistApi } from "../../../../../redux/actions/CheckUserExistAction";
import { SendOtpApi } from "../../../../../redux/actions/OtpAction";
import OrientationLoadingOverlay from "../../../../../utils/CustomLoader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from '@react-native-firebase/messaging';

export default class RegisterScreen extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            userType: "",
            fName: "",
            lName: "",
            email: "",
            password: "",
            confirmPassword: "",
            nationalId: "",
            houseNumber: "",
            streetName: "",
            locationLat: "",
            locationLng: "",
            wardName: "",
            district: "",
            region: "",
            isSocial: "no",
            socialType: "",
            socialId: "",
            refreshData: false,
            isLoading: false,
            hasEmail: "no",
            deviceToken: '',
            showPassword1: true,
            showPassword2: true
        };

        this.isVisible = false;
        this.controller1;
        this.pNumber = "+91";
        this.alternateNumber = "+91";
    }


    componentDidMount = () => {
        const { socialData } = this.props.route.params;
        AsyncStorage.getItem("deviceToken").then((result) => {
            if (result !== undefined && result !== null) {
                this.setState({
                    deviceToken: result
                })
            }
        });
        if (socialData === false) {

        } else {
            this.setState({
                isSocial: "yes",
                socialType: socialData[0].social_profile,
                socialId: socialData[0].social_id,
                fName: socialData[0].name.indexOf(' ') >= 0 ? socialData[0].name.split(' ').slice(0, -1).join(' ') : socialData[0].name,
                lName: socialData[0].name.indexOf(' ') >= 0 ? socialData[0].name.split(' ').slice(-1).join(' ') : "",
                email: socialData[0].email,
                hasEmail: socialData[0].email === undefined || socialData[0].email === null || socialData[0].email === "" ? "no" : "yes",
            })
        }

    };

    onRegisterPress = async () => {
        const { userType, fName, lName, email, socialId, socialType, isSocial, pNumber, alternateNumber, password, confirmPassword, nationalId, houseNumber, streetName, wardName, district, region, deviceToken } = this.state;
        const { navigate } = this.props.navigation;
        if (userType.length === 0) {
            this.showToastAlert(STRINGS.EMPTY_I_AM_A_FIELD)
        } else if (fName.trim().length === 0) {
            this.showToastAlert(STRINGS.EMPTY_FIRST_NAME)
        } else if (lName.trim().length === 0) {
            this.showToastAlert(STRINGS.EMPTY_LAST_NAME)
        } else if (email.length === 0) {
            this.showToastAlert(STRINGS.EMPTY_EMAIL)
        } else if (!validateEmail(email)) {
            this.showToastAlert(STRINGS.VALID_EMAIL)
        } else if (!this.phone.isValidNumber()) {
            this.showToastAlert(STRINGS.VALID_PHONE_NUMBER)
        } else if (password.length === 0) {
            this.showToastAlert(STRINGS.EMPTY_PASSWORD)
        } else if (!validatePassword(password)) {
            this.showToastAlert(STRINGS.VALID_PASSWORD)
        } else if (confirmPassword.length === 0) {
            this.showToastAlert(STRINGS.EMPTY_CONFIRM_PASSWORD)
        } else if (password !== confirmPassword) {
            this.showToastAlert(STRINGS.CONFIRM_PASSWORD_MISMATCH)
        } else if (userType.toLowerCase() === "patient" && nationalId.length < 1) {
            this.showToastAlert(STRINGS.EMPTY_NATIONAL_ID)
        }
        else if (userType.length > 1 && nationalId.length > 1 && nationalId.length < 20) {
            this.showToastAlert(STRINGS.EMPTY_NATIONAL_ID_MUST_BE_TWENTY)
        }
        else if (houseNumber.length < 1) {
            this.showToastAlert(STRINGS.EMPTY_HOUSE_NUMBER)
        } else if (streetName.length < 1) {
            this.showToastAlert(STRINGS.EMPTY_STREET_NAME)
        } else if (district.length < 1) {
            this.showToastAlert(STRINGS.EMPTY_DISTRICT)
        } else if (region.length < 1) {
            this.showToastAlert(STRINGS.EMPTY_REGION)
        } else {
            if (this.isConnected()) {
                let fcmT = "";
                const authStatus = await messaging().requestPermission();
                const enabled =
                    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        
                if (enabled) {
                    fcmT = await messaging().getToken();
                    AsyncStorage.setItem("deviceToken", fcmT)
                } else {
        
                }
                let registerPayload = {
                    user_type: userType,
                    first_name: fName,
                    last_name: lName,
                    email: email,
                    phone_number: this.phone.getValue(),
                    alternative_number: alternateNumber,
                    password: password,
                    c_password: confirmPassword,
                    national_id: nationalId,
                    house_number: houseNumber,
                    street_name: streetName,
                    ward_name: wardName,
                    region: region,
                    district: district,
                    provider_id: socialId,
                    provider_name: socialType,
                    is_social_account: isSocial,
                    //add token
                    deviceToken: fcmT === "" ? deviceToken : fcmT,
                };
                this.showDialog();
                debugger
                CheckUserExistApi({
                    "email": email,
                    "phone_number": this.phone.getValue(),
                    "national_id": nationalId
                }, response => this.handleVerifyUserResponse(response, registerPayload));
            } else {
                this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
            }
        }
    };

    handleVerifyUserResponse = (response, registerPayload) => {
        debugger
        if (response !== undefined && response !== null) {
            if (response.code === 200) {
                let formattedPhoneNumber = "+" + this.phone.getCountryCode() + " " + this.phone.getValue().slice(this.phone.getCountryCode().length + 1);
                SendOtpApi({
                    phone_number: formattedPhoneNumber
                }, response => this.handleSendOtpResponse(response, registerPayload, formattedPhoneNumber))
            } else if (response.code === 204) {
                this.hideDialog()
                this.showToastAlert(response.message);
            } else if (response.code === 400) {
                this.hideDialog()
                if (response.data !== undefined) {
                    if (response.data.email !== undefined) {
                        this.showToastAlert(response.data.email[0]);
                    } else if (response.data.phone_number !== undefined) {
                        this.showToastAlert(response.data.phone_number[0]);
                    } else if (response.data.national_id !== undefined) {
                        this.showToastAlert(response.data.national_id[0]);
                    }
                }
            } else if (response.code === 401) {
                this.hideDialog()
                this.showToastAlert(response.message);
            } else if (response.code === 500) {
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

    handleSendOtpResponse = (response, registerPayload, formattedPhoneNumber) => {
        const { navigation } = this.props;
        const { navigate } = navigation;
        if (response !== undefined && response !== null) {
            this.hideDialog()
            if (response.body !== undefined) {
                this.showToastSucess(STRINGS.OTP_SENT_SUCCESSFULLY);
                navigate("VerifyOtpScreen", { registerPayload, formattedPhoneNumber })
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

    showPassword(type) {
        const { showPassword1, showPassword2, } = this.state;
        switch (type) {
            case 1:
                this.setState({ showPassword1: !showPassword1 });
                break;
            case 2:
                this.setState({ showPassword2: !showPassword2 });
                break;
        }
    }

    _renderInputText = () => {
        const { refreshData, userType, fName, isSocial, lName, hasEmail, email, pNumber, alternateNumber, password, confirmPassword, nationalId,
            houseNumber, streetName, wardName, district, region, showPassword1, showPassword2 } = this.state;
        return (
            <View style={{ alignItems: "center" }}>
                <Spacer space={3} />
                <TextInputHeadingComponent requireStar={true} title={STRINGS.I_AM_A_TEXT} />
                <DropDownPicker
                    items={[
                        { label: 'Patient', value: 'Patient' },
                        { label: 'Doctor', value: 'Doctor' }
                    ]}
                    controller={instance => this.controller1 = instance}
                    defaultValue={userType}
                    onOpen={() => this.isVisible = true}
                    onClose={() => this.isVisible = false}
                    containerStyle={{ width: wp("76%") }}
                    style={{
                        backgroundColor: 'transparent',
                        paddingLeft: 0,
                        paddingRight: wp("1%"),
                        paddingBottom: wp("2.5%"),
                        paddingTop: wp("3.5%"),
                        borderWidth: 0,
                        borderBottomColor: "#DDE7E6",
                        borderBottomWidth: 2
                    }}
                    itemStyle={{
                        justifyContent: 'flex-start',
                    }}
                    labelStyle={{
                        color: COLORS.GREY_COLOR,
                        fontSize: FONT.TextNormal,
                        fontFamily: FONT_FAMILY.MontserratRegular
                    }}
                    placeholder={STRINGS.SELECT_ITEM}
                    dropDownStyle={{ backgroundColor: COLORS.WHITE_COLOR }}
                    onChangeItem={item => {
                        this.isVisible = false;
                        this.setState({
                            userType: item.value
                        }, () => this.refs.fName.focus())
                    }
                    }
                    selectedLabelStyle={{
                        color: COLORS.GREY_COLOR,
                        fontSize: FONT.TextNormal,
                        fontFamily: FONT_FAMILY.MontserratRegular
                    }}
                    activeLabelStyle={{ color: COLORS.APP_THEME_COLOR }}
                    customArrowUp={() => <Image source={AUTH_IMAGES.DROP_DOWN_ICON} resizeMode={'contain'} />}
                    customArrowDown={() => <Image source={AUTH_IMAGES.DROP_DOWN_ICON} resizeMode={'contain'} />}
                />
                <Spacer space={3.5} />

                <TextInputHeadingComponent requireStar={true} title={STRINGS.FIRST_NAME_TEXT} />
                <Input
                    inputContainerStyle={{
                        borderBottomColor: "#DDE7E6",
                        borderBottomWidth: 2,
                        alignItems: "center",
                        width: wp("76%")
                    }}
                    placeholder={""}
                    placeholderTextColor={COLORS.PLACEHOLDERS_COLOR}
                    ref="fName"
                    value={fName}
                    autoCapitalize='none'
                    onChangeText={(text) => this.setState({
                        fName: text
                    })}
                    returnKeyType={"next"}
                    onSubmitEditing={() => {
                        this.refs.lName.focus()
                    }}
                    inputStyle={{
                        color: COLORS.GREY_COLOR,
                        fontSize: FONT.TextNormal,
                        fontFamily: FONT_FAMILY.MontserratRegular
                    }}
                    rightIcon={<Image source={AUTH_IMAGES.USER_ICON} resizeMode={'contain'} />}
                />

                <TextInputHeadingComponent requireStar={true} title={STRINGS.LAST_NAME_TEXT} />
                <Input
                    inputContainerStyle={{
                        borderBottomColor: "#DDE7E6",
                        borderBottomWidth: 2,
                        alignItems: "center",
                        width: wp("76%")
                    }}
                    placeholder=''
                    placeholderTextColor={COLORS.PLACEHOLDERS_COLOR}
                    ref="lName"
                    value={lName}
                    onChangeText={(text) => this.setState({
                        lName: text
                    })}
                    returnKeyType={"next"}
                    onSubmitEditing={() => {
                        this.refs.email.focus()
                    }}
                    inputStyle={{
                        color: COLORS.GREY_COLOR,
                        fontSize: FONT.TextNormal,
                        fontFamily: FONT_FAMILY.MontserratRegular
                    }}
                    rightIcon={<Image source={AUTH_IMAGES.USER_ICON} resizeMode={'contain'} />}
                />

                <TextInputHeadingComponent requireStar={true} title={STRINGS.EMAIL_ID_TEXT} />
                <Input
                    inputContainerStyle={{
                        borderBottomColor: "#DDE7E6",
                        borderBottomWidth: 2,
                        alignItems: "center",
                        width: wp("76%")
                    }}
                    placeholder=''
                    placeholderTextColor={COLORS.PLACEHOLDERS_COLOR}
                    ref="email"
                    value={email}
                    editable={isSocial === "no" || hasEmail === "no"}
                    keyboardType={"email-address"}
                    onChangeText={(text) => this.setState({
                        email: text.trim(),
                    })}
                    returnKeyType={"next"}
                    onSubmitEditing={() => {
                        this.phone.focus()
                    }}
                    inputStyle={{
                        color: COLORS.GREY_COLOR,
                        fontSize: FONT.TextNormal,
                        fontFamily: FONT_FAMILY.MontserratRegular
                    }}
                    rightIcon={<Image source={AUTH_IMAGES.EMAIL_ICON} resizeMode={'contain'} />}
                />

                <TextInputHeadingComponent requireStar={true} title={STRINGS.MOBILE_NUMBER_TEXT} />
                <Input
                    inputContainerStyle={{
                        borderBottomColor: "#DDE7E6",
                        borderBottomWidth: 2,
                        alignItems: "center",
                        width: wp("76%")
                    }}
                    InputComponent={() => {
                        return (
                            <View>
                                <PhoneInput
                                    initialCountry={""}
                                    autoFormat
                                    ref={(ref) => {
                                        this.phone = ref;
                                    }}
                                    textStyle={{
                                        color: COLORS.GREY_COLOR,
                                        fontSize: FONT.TextNormal,
                                        fontFamily: FONT_FAMILY.MontserratRegular
                                    }}
                                    value={this.pNumber}
                                    onSelectCountry={(country) => {
                                        this.setState({
                                            refreshData: !refreshData
                                        })
                                        this.pNumber = "+" + this.phone.getCountryCode()
                                    }}
                                    onChangePhoneNumber={(num) => {
                                        this.pNumber = num
                                    }}
                                    onSubmitEditing={(value) => {
                                        this.pNumber = value
                                        this.aPhone.focus()
                                    }}
                                    style={{
                                        width: wp("71%"),
                                    }}
                                />
                            </View>
                        )
                    }}
                    rightIcon={<Image source={AUTH_IMAGES.PHONE_ICON} resizeMode={'contain'} />}
                />

                <TextInputHeadingComponent requireStar={false} title={STRINGS.ALTERNATE_NUMBER_TEXT} />
                <Input
                    inputContainerStyle={{
                        borderBottomColor: "#DDE7E6",
                        borderBottomWidth: 2,
                        alignItems: "center",
                        width: wp("76%")
                    }}
                    InputComponent={() => {
                        return (
                            <View>
                                <PhoneInput
                                    initialCountry={""}
                                    autoFormat={true}
                                    ref={(ref) => {
                                        this.aPhone = ref;
                                    }}
                                    textStyle={{
                                        color: COLORS.GREY_COLOR,
                                        fontSize: FONT.TextNormal,
                                        fontFamily: FONT_FAMILY.MontserratRegular
                                    }}
                                    value={this.alternateNumber}
                                    onSelectCountry={(country) => {
                                        this.setState({
                                            refreshData: !refreshData
                                        })
                                        this.alternateNumber = "+" + this.aPhone.getCountryCode()
                                    }}
                                    onChangePhoneNumber={(num) => {
                                        this.alternateNumber = num
                                    }}
                                    onSubmitEditing={(value) => {
                                        this.alternateNumber = value
                                        this.refs.password.focus()
                                    }}
                                    style={{
                                        width: wp("71%"),
                                    }}
                                />
                            </View>
                        )
                    }}
                    rightIcon={<Image source={AUTH_IMAGES.PHONE_ICON} resizeMode={'contain'} />}
                />

                <TextInputHeadingComponent requireStar={true} title={STRINGS.PASSWORD_TEXT} />
                <Input
                    inputContainerStyle={{
                        borderBottomColor: "#DDE7E6",
                        borderBottomWidth: 2,
                        alignItems: "center",
                        width: wp("76%")
                    }}
                    placeholder=''
                    placeholderTextColor={COLORS.PLACEHOLDERS_COLOR}
                    ref="password"
                    value={password}
                    secureTextEntry={showPassword1}
                    onChangeText={(text) => this.setState({
                        password: text.trim()
                    })}
                    returnKeyType={"next"}
                    onSubmitEditing={() => {
                        this.refs.confirmPassword.focus()
                    }}
                    inputStyle={{
                        color: COLORS.GREY_COLOR,
                        fontSize: FONT.TextNormal,
                        fontFamily: FONT_FAMILY.MontserratRegular
                    }}
                    rightIcon={<TouchableOpacity onPress={() => this.showPassword(1)}>
                        <Image
                            source={showPassword1 ? AUTH_IMAGES.PASSWORD_ICON : AUTH_IMAGES.SHOW_PASSWORD_ICON}
                            resizeMode={'contain'} />
                    </TouchableOpacity>}
                />

                <TextInputHeadingComponent requireStar={true} title={STRINGS.CONFIRM_PASSWORD_TEXT} />
                <Input
                    inputContainerStyle={{
                        borderBottomColor: "#DDE7E6",
                        borderBottomWidth: 2,
                        alignItems: "center",
                        width: wp("76%")
                    }}
                    placeholder=''
                    placeholderTextColor={COLORS.PLACEHOLDERS_COLOR}
                    ref="confirmPassword"
                    value={confirmPassword}
                    secureTextEntry={showPassword2}
                    onChangeText={(text) => this.setState({
                        confirmPassword: text
                    })}
                    returnKeyType={"next"}
                    onSubmitEditing={() => {
                        this.refs.nationalId.focus()
                    }}
                    inputStyle={{
                        color: COLORS.GREY_COLOR,
                        fontSize: FONT.TextNormal,
                        fontFamily: FONT_FAMILY.MontserratRegular
                    }}
                    rightIcon={<TouchableOpacity onPress={() => this.showPassword(2)}>
                        <Image
                            source={showPassword2 ? AUTH_IMAGES.PASSWORD_ICON : AUTH_IMAGES.SHOW_PASSWORD_ICON}
                            resizeMode={'contain'} />
                    </TouchableOpacity>}
                />

                <TextInputHeadingComponent requireStar={userType.toLowerCase() === "patient" ? true : false}
                    title={STRINGS.NATIONAL_ID_TEXT} />
                <Input
                    inputContainerStyle={{
                        borderBottomColor: "#DDE7E6",
                        borderBottomWidth: 2,
                        alignItems: "center",
                        width: wp("76%")
                    }}
                    keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                    maxLength={20}
                    placeholder=''
                    placeholderTextColor={COLORS.PLACEHOLDERS_COLOR}
                    ref="nationalId"
                    value={nationalId}
                    onChangeText={(text) =>
                        this.setState({
                            nationalId: text.replace(/[- #*;,.<>\{\}\[\]\\\/]/gi, '')
                        })
                    }
                    returnKeyType={"next"}
                    onSubmitEditing={() => {
                        this.refs.houseNumber.focus()
                    }}
                    inputStyle={{
                        color: COLORS.GREY_COLOR,
                        fontSize: FONT.TextNormal,
                        fontFamily: FONT_FAMILY.MontserratRegular
                    }}
                    rightIcon={<Image source={AUTH_IMAGES.CARD_ICON} resizeMode={'contain'} />}
                />

                <TextInputHeadingComponent requireStar={true} title={STRINGS.HOUSE_NUMBER_TEXT} />
                <Input
                    inputContainerStyle={{
                        borderBottomColor: "#DDE7E6",
                        borderBottomWidth: 2,
                        alignItems: "center",
                        width: wp("76%")
                    }}
                    placeholder=''
                    placeholderTextColor={COLORS.PLACEHOLDERS_COLOR}
                    ref="houseNumber"
                    value={houseNumber}
                    onChangeText={(text) => this.setState({
                        houseNumber: text
                    })}
                    returnKeyType={"next"}
                    inputStyle={{
                        color: COLORS.GREY_COLOR,
                        fontSize: FONT.TextNormal,
                        fontFamily: FONT_FAMILY.MontserratRegular
                    }}
                    rightIcon={<Image source={AUTH_IMAGES.LOCATION_ICON} resizeMode={'contain'} />}
                />

                <TextInputHeadingComponent requireStar={true} title={STRINGS.STREET_NAME_TEXT} />
                <Input
                    inputContainerStyle={{
                        borderBottomColor: "#DDE7E6",
                        borderBottomWidth: 2,
                        alignItems: "flex-start",
                        width: wp("76%"),
                    }}
                    InputComponent={() => {
                        return (
                            <AutoCompleteComponent
                                value={streetName}
                                onSelect={(data, details) => {
                                    this.setState({
                                        streetName: data.description,
                                        locationLat: details.geometry.location.lat,
                                        locationLong: details.geometry.location.lng
                                    });
                                    this.refs.wardName.focus()
                                }}
                            />
                        )
                    }}
                    rightIcon={<Image source={AUTH_IMAGES.LOCATION_ICON} resizeMode={'contain'} />}
                />

                <TextInputHeadingComponent requireStar={false} title={STRINGS.WARD_NAME_TEXT} />
                <Input
                    inputContainerStyle={{
                        borderBottomColor: "#DDE7E6",
                        borderBottomWidth: 2,
                        alignItems: "center",
                        width: wp("76%")
                    }}
                    placeholder=''
                    placeholderTextColor={COLORS.PLACEHOLDERS_COLOR}
                    ref="wardName"
                    value={wardName}
                    onChangeText={(text) => this.setState({
                        wardName: text
                    })}
                    returnKeyType={"next"}
                    onSubmitEditing={() => {
                        this.refs.district.focus()
                    }}
                    inputStyle={{
                        color: COLORS.GREY_COLOR,
                        fontSize: FONT.TextNormal,
                        fontFamily: FONT_FAMILY.MontserratRegular
                    }}
                />

                <TextInputHeadingComponent requireStar={true} title={STRINGS.DISTRICT_TEXT} />
                <Input
                    inputContainerStyle={{
                        borderBottomColor: "#DDE7E6",
                        borderBottomWidth: 2,
                        alignItems: "center",
                        width: wp("76%")
                    }}
                    placeholder=''
                    placeholderTextColor={COLORS.PLACEHOLDERS_COLOR}
                    ref="district"
                    value={district}
                    onChangeText={(text) => this.setState({
                        district: text
                    })}
                    returnKeyType={"next"}
                    onSubmitEditing={() => {
                        this.refs.region.focus()
                    }}
                    inputStyle={{
                        color: COLORS.GREY_COLOR,
                        fontSize: FONT.TextNormal,
                        fontFamily: FONT_FAMILY.MontserratRegular
                    }}
                    rightIcon={<Image source={AUTH_IMAGES.LOCATION_ICON} resizeMode={'contain'} />}
                />

                <TextInputHeadingComponent requireStar={true} title={STRINGS.REGION_TEXT} />
                <Input
                    inputContainerStyle={{
                        borderBottomColor: "#DDE7E6",
                        borderBottomWidth: 2,
                        alignItems: "center",
                        width: wp("76%")
                    }}
                    placeholder=''
                    placeholderTextColor={COLORS.PLACEHOLDERS_COLOR}
                    ref="region"
                    value={region}
                    onChangeText={(text) => this.setState({
                        region: text
                    })}
                    returnKeyType={"done"}
                    inputStyle={{
                        color: COLORS.GREY_COLOR,
                        fontSize: FONT.TextNormal,
                        fontFamily: FONT_FAMILY.MontserratRegular
                    }}
                    rightIcon={<Image source={AUTH_IMAGES.LOCATION_ICON} resizeMode={'contain'} />}
                />
            </View>
        )
    };

    _renderCardView = () => {
        return (
            <CardContainerStyle>
                <CardHeadingStyle>{STRINGS.CREATE_ACCOUNT_TEXT}</CardHeadingStyle>
                <Spacer space={4} />
                {this._renderInputText()}
                <Spacer space={5} />
                <ShadowViewContainer style={{ borderRadius: wp("8%") }}>
                    <NewPrimaryButton
                        btnText={STRINGS.REGISTER_NOW_TEXT}
                        width={56}
                        borderRadius={wp("8%")}
                        verticalPaddingWithText={4}
                        isTextBold={true}
                        onPress={() => this.onRegisterPress()}
                    />
                </ShadowViewContainer>
                <Spacer space={.5} />
            </CardContainerStyle>
        )
    };

    _renderCustomLoader = () => {
        const { isLoading } = this.state;
        return (
            <OrientationLoadingOverlay visible={isLoading} message="Loading.." />
        )
    };

    render() {
        const { navigation } = this.props;
        return (
            <SafeAreaViewContainer>
                <KeyboardAvoidingView
                    style={{ flex: 1, backgroundColor: COLORS.APP_BACKGROUND_COLOR }}
                    behavior={(Platform.OS === 'ios') ? 'padding' : null}>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            Keyboard.dismiss()
                        }}>
                        <ScrollContainer keyboardShouldPersistTaps={"handled"} bounces={false}>
                            <MainContainer onTouchEnd={() => {
                                if (this.isVisible === true) {
                                    this.controller1.close()
                                }
                            }}>
                                <CurvedImageBackground />
                                <AbsoluteContainer>
                                    <View style={{ width: wp("90%") }}>
                                        <AntDesign
                                            name={"arrowleft"}
                                            color={COLORS.WHITE_COLOR}
                                            size={30}
                                            onPress={() => navigation.pop()}
                                        />
                                    </View>
                                    <Spacer space={6} />
                                    <AppIconImageComponent />
                                    <FillInfoTextComponent />
                                    <Spacer space={4} />
                                    {this._renderCardView()}
                                </AbsoluteContainer>
                                <Spacer space={4} />
                            </MainContainer>
                            {this._renderCustomLoader()}
                        </ScrollContainer>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </SafeAreaViewContainer>
        )
    }
}
