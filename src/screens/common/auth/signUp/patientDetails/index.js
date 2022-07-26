import React from "react";
import {
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,
    Image,
    View,
    TextInput
} from "react-native";
import { Input } from "react-native-elements"
import AntDesign from "react-native-vector-icons/AntDesign";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import RadioForm from 'react-native-simple-radio-button';
import DropDownPicker from 'react-native-dropdown-picker';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from "@react-native-community/async-storage";

import {
    TextInputHeading
} from "./styles";
import { AUTH_IMAGES } from "../../../../../utils/ImagePaths";
import { Spacer } from "../../../../../components/spacer";
import STRINGS from "../../../../../utils/Strings";
import { FONT_FAMILY } from "../../../../../themes/FontFamilies";
import { FONT } from "../../../../../themes/FontSizes";
import { NewPrimaryButton } from "../../../../../components/buttons/primaryButton";
import {
    AppIconImageComponent,
    CurvedImageBackground,
    FillInfoTextComponent,
    TextInputHeadingComponent
} from "../../authComponents";
import { AbsoluteContainer, CardContainerStyle, CardHeadingStyle } from "../../authComponents/styles";
import COLORS from "../../../../../themes/Colors";
import BaseClass from "../../../../../utils/BaseClass";
import {
    MainContainer,
    SafeAreaViewContainer,
    ScrollContainer,
    ShadowViewContainer
} from "../../../../../utils/BaseStyles";
import { TextAreaContainer } from "../medicalDetails/styles";
import PhoneInput from "../../../../../../local_modules/react-native-phone-input";
import { RegisterPatientDetailsApi } from "../../../../../redux/actions/SignUpAction";
import {
    RelationshipsData,
    AgeOptionsData,
    BloodGroupOptionsData,
    GenderOptionsData
} from "../../../../../utils/CommonStaticData";
import OrientationLoadingOverlay from "../../../../../utils/CustomLoader";
import * as _ from "lodash";
import { ConnectycubeAuthServices } from "../../../../../utils/services";

export default class PatientDetails extends BaseClass {

    constructor(props) {
        super(props);
        this.state = {
            deviceToken: "",
            firstName: "",
            lastName: "",
            drugHistory: "",
            pastDisease: "",
            surgeryAndComplications: "",
            patientType: 0,
            temp: false,
            isLoading: false
        };

        this.isVisible1 = false;
        this.isVisible2 = false;
        this.isVisible3 = false;
        this.isVisible4 = false;

        this.controller1;
        this.controller2;
        this.controller3;
        this.controller4;

        this.relation = "Select Relation";
        this.age = "Select Age";
        this.bloodGroup = "Select Blood Group";
        this.gender = "Select Gender";
        this.isDiabetic = null;
        this.isBloodPressue = null;
        this.isSmoking = null;
        this.emergenyContact1 = "+91";
        this.emergenyContact2 = "+91";
    }

    componentDidMount() {
        AsyncStorage.getItem("deviceToken").then((result) => {
            if (result !== undefined && result !== null) {

                this.setState({
                    deviceToken: result
                })
            }
        });
    }

    onNextPress = () => {
        const { data } = this.props.route.params;
        const { patientType, firstName, lastName, drugHistory, pastDisease, surgeryAndComplications } = this.state;
        if (patientType == 0) {
            if (firstName.length < 1) {
                this.showToastAlert(STRINGS.EMPTY_FIRST_NAME);
            } else if (lastName.length < 1) {
                this.showToastAlert(STRINGS.EMPTY_LAST_NAME);
            } else if (this.relation === "Select Relation") {
                this.showToastAlert(STRINGS.EMPTY_RELATION);
            } else if (this.age === "Select Age") {
                this.showToastAlert(STRINGS.EMPTY_AGE);
            } else if (this.bloodGroup === "Select Blood Group") {
                this.showToastAlert(STRINGS.EMPTY_BLOOD_GROUP);
            } else if (this.gender === "Select Gender") {
                this.showToastAlert(STRINGS.EMPTY_GENDER);
            } else if (!this.phone.isValidNumber()) {
                this.showToastAlert(STRINGS.VALID_EMERGENCY_CONTACT);
            } else {
                if (this.isConnected()) {
                    // this.showDialog();
                    RegisterPatientDetailsApi({
                        id: data.id,
                        apply_for: patientType == 0 ? "other" : "self",
                        patient_first_name: firstName,
                        patient_last_name: lastName,
                        relation: this.relation,
                        emergency_contact1: patientType == 0 ? this.phone.getValue() : "",
                        emergency_contact2: patientType == 0 ? this.aPhone.getValue() : "",
                        age: this.age,
                        blood_group: this.bloodGroup,
                        gender: this.gender,
                        is_diabetic: this.isDiabetic ? "yes" : "no",
                        is_blood_pressure_problem: this.isBloodPressue ? "yes" : "no",
                        is_smoking_habit: this.isSmoking ? "yes" : "no",
                        drug_history: drugHistory,
                        post_diseases: pastDisease,
                        surgery_complication: surgeryAndComplications
                    }, response => this.handleRegisterPatientDetailsResponse(response))
                } else {
                    this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
                }
            }
        } else {
            if (this.age === "Select Age") {
                this.showToastAlert(STRINGS.EMPTY_AGE);
            } else if (this.bloodGroup === "Select Blood Group") {
                this.showToastAlert(STRINGS.EMPTY_BLOOD_GROUP);
            } else if (this.gender === "Select Gender") {
                this.showToastAlert(STRINGS.EMPTY_GENDER);
            } else {
                if (this.isConnected()) {
                    // this.showDialog();
                    RegisterPatientDetailsApi({
                        id: data.id,
                        apply_for: patientType == 0 ? "other" : "self",
                        patient_first_name: firstName,
                        patient_last_name: lastName,
                        relation: this.relation,
                        emergency_contact1: patientType == 0 ? this.phone.getValue() : "",
                        emergency_contact2: patientType == 0 ? this.aPhone.getValue() : "",
                        age: this.age,
                        blood_group: this.bloodGroup,
                        gender: this.gender,
                        is_diabetic: this.isDiabetic ? "yes" : "no",
                        is_blood_pressure_problem: this.isBloodPressue ? "yes" : "no",
                        is_smoking_habit: this.isSmoking ? "yes" : "no",
                        drug_history: drugHistory,
                        post_diseases: pastDisease,
                        surgery_complication: surgeryAndComplications
                    }, response => this.handleRegisterPatientDetailsResponse(response))
                } else {
                    this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
                }
            }
        }
    };

    handleRegisterPatientDetailsResponse = (response) => {
        const { navigation } = this.props;
        const { navigate } = navigation;
        const { deviceToken } = this.state;
        const { data } = this.props.route.params;
        if (response !== undefined && response !== null) {            
            if (response.code === 200) {
                debugger
                console.warn("data", response.data)
                // AsyncStorage.setItem(STRINGS.LOGIN_DATA, JSON.stringify(response.data));
                this.showToastSucess(STRINGS.REGISTRATION_SUCCESSFUL);
                let user = {
                    id: response.data.connect_cube_details.connect_cube_id,
                    email: response.data.user_data.email,
                    password: "Mind@123",
                }

                const _onSuccessLogin = (success) => {

                };

                const _onErrorLogin = (error) => {

                }

                ConnectycubeAuthServices.login(user, deviceToken)
                    .then(_onSuccessLogin)
                    .catch(_onErrorLogin)

                if (response.data.user_data.user_type.toLowerCase() === "patient" || response.data.user_data.user_type.toLowerCase() === "caretaker") {
                    //navigate user to payment screen
                    navigate("PaymentScreen", {
                        paymentSender: response.data.user_data.id,
                        paymentReceiver: 10,
                        request_id: 0,
                        screen_type: 'login',
                        loginData: response.data
                    })
                    // navigation.dispatch(
                    //     CommonActions.reset({
                    //         index: 0,
                    //         routes: [
                    //             {
                    //                 name: 'PatientDrawer'
                    //             },
                    //         ],
                    //     })
                    // )
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
    };


    renderSection = () => {
        const { firstName, lastName, patientType } = this.state;
        return patientType == 0 ? <View style={{ alignItems: "center" }}>
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
                ref="Firstname"
                value={firstName}
                autoCapitalize='none'
                onChangeText={(text) => this.setState({
                    firstName: text.trim(),
                })}
                returnKeyType={"next"}
                onSubmitEditing={() => {
                    this.refs.Lastname.focus()
                }}
                inputStyle={{
                    color: COLORS.GREY_COLOR,
                    fontSize: FONT.TextNormal,
                    fontFamily: FONT_FAMILY.MontserratRegular
                }}
                rightIcon={<Image source={AUTH_IMAGES.NAME_ICON} resizeMode={'contain'} />}
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
                ref="Lastname"
                value={lastName}
                onChangeText={(text) => this.setState({
                    lastName: text.trim(),
                })}
                returnKeyType={"done"}
                inputStyle={{
                    color: COLORS.GREY_COLOR,
                    fontSize: FONT.TextNormal,
                    fontFamily: FONT_FAMILY.MontserratRegular
                }}
                rightIcon={<Image source={AUTH_IMAGES.NAME_ICON} resizeMode={'contain'} />}
            />
        </View> : <View style={{ alignItems: "center" }} />
    };


    renderPhoneInputsView = () => {
        return (
            <View>
                <TextInputHeadingComponent requireStar={true} title={STRINGS.EMERGENCY_CONTACT_1_TEXT} />
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
                                    value={this.emergenyContact1}
                                    onSelectCountry={(country) => {
                                        this.setState({
                                            temp: !this.state.temp
                                        })
                                        this.emergenyContact1 = "+" + this.phone.getCountryCode();
                                    }}
                                    onChangePhoneNumber={(num) => {
                                        this.emergenyContact1 = num
                                    }}
                                    onSubmitEditing={(value) => {
                                        this.emergenyContact1 = value
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
                <Spacer space={3} />
                <TextInputHeadingComponent requireStar={false} title={STRINGS.EMERGENCY_CONTACT_2_TEXT} />
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
                                    value={this.emergenyContact2}
                                    onSelectCountry={(country) => {
                                        this.setState({
                                            temp: !this.state.temp
                                        })
                                        this.emergenyContact2 = "+" + this.aPhone.getCountryCode();
                                    }}
                                    onChangePhoneNumber={(num) => {
                                        this.emergenyContact2 = num
                                    }}
                                    onSubmitEditing={(value) => {
                                        this.emergenyContact2 = value
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

            </View>
        )
    }

    _renderInputText = () => {
        const { drugHistory, pastDisease, surgeryAndComplications, patientType } = this.state;
        return (
            <View style={{ alignItems: "center" }}>
                {this.renderSection()}
                {patientType === 0 &&
                    <>
                        <TextInputHeadingComponent requireStar={true} title={STRINGS.RELATION_TEXT} />
                        <DropDownPicker
                            items={RelationshipsData}
                            defaultValue={this.relation}
                            zIndex={10}
                            controller={instance => this.controller1 = instance}
                            onOpen={() => this.isVisible1 = true}
                            onClose={() => this.isVisible1 = false}
                            placeholder="Select Relation"
                            containerStyle={{ width: wp("76%") }}
                            style={{
                                backgroundColor: COLORS.TRANSPARENT,
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
                            dropDownStyle={{ backgroundColor: COLORS.WHITE_COLOR }}
                            onChangeItem={item => {
                                this.isVisible1 = false;
                                this.relation = item.value
                            }}
                            selectedLabelStyle={{
                                color: COLORS.GREY_COLOR,
                                fontSize: FONT.TextNormal,
                                fontFamily: FONT_FAMILY.MontserratRegular
                            }}
                            activeLabelStyle={{ color: COLORS.APP_THEME_COLOR }}
                            customArrowUp={() => <Image source={AUTH_IMAGES.DROP_DOWN_ICON} resizeMode={'contain'} />}
                            customArrowDown={() => <Image source={AUTH_IMAGES.DROP_DOWN_ICON} resizeMode={'contain'} />}
                        />
                        <Spacer space={3} />
                    </>
                }
                <TextInputHeadingComponent requireStar={true} title={STRINGS.AGE_TEXT} />
                <DropDownPicker
                    items={AgeOptionsData}
                    controller={instance => this.controller2 = instance}
                    onOpen={() => this.isVisible2 = true}
                    onClose={() => this.isVisible2 = false}
                    defaultValue={this.age}
                    zIndex={8}
                    placeholder="Select Age"
                    containerStyle={{ width: wp("76%") }}
                    style={{
                        backgroundColor: COLORS.TRANSPARENT,
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
                    dropDownStyle={{ backgroundColor: COLORS.WHITE_COLOR }}
                    onChangeItem={item => {
                        this.isVisible2 = false
                        this.age = item.value
                    }}
                    selectedLabelStyle={{
                        color: COLORS.GREY_COLOR,
                        fontSize: FONT.TextNormal,
                        fontFamily: FONT_FAMILY.MontserratRegular
                    }}
                    activeLabelStyle={{ color: COLORS.APP_THEME_COLOR }}
                    customArrowUp={() => <Image source={AUTH_IMAGES.DROP_DOWN_ICON} resizeMode={'contain'} />}
                    customArrowDown={() => <Image source={AUTH_IMAGES.DROP_DOWN_ICON} resizeMode={'contain'} />}
                />
                <Spacer space={3} />
                <TextInputHeadingComponent requireStar={true} title={STRINGS.BLOOD_GROUP_TEXT} />
                <DropDownPicker
                    items={BloodGroupOptionsData}
                    controller={instance => this.controller3 = instance}
                    onOpen={() => this.isVisible3 = true}
                    onClose={() => this.isVisible3 = false}
                    defaultValue={this.bloodGroup}
                    zIndex={6}
                    placeholder="Select Blood Group"
                    containerStyle={{ width: wp("76%") }}
                    style={{
                        backgroundColor: COLORS.TRANSPARENT,
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
                    dropDownStyle={{ backgroundColor: COLORS.WHITE_COLOR }}
                    onChangeItem={item => {
                        this.isVisible3 = false
                        this.bloodGroup = item.value
                    }}
                    selectedLabelStyle={{
                        color: COLORS.GREY_COLOR,
                        fontSize: FONT.TextNormal,
                        fontFamily: FONT_FAMILY.MontserratRegular
                    }}
                    activeLabelStyle={{ color: COLORS.APP_THEME_COLOR }}
                    customArrowUp={() => <Image source={AUTH_IMAGES.DROP_DOWN_ICON} resizeMode={'contain'} />}
                    customArrowDown={() => <Image source={AUTH_IMAGES.DROP_DOWN_ICON} resizeMode={'contain'} />}
                />
                <Spacer space={3} />
                <TextInputHeadingComponent requireStar={true} title={STRINGS.GENDER_TEXT} />
                <DropDownPicker
                    items={GenderOptionsData}
                    controller={instance => this.controller4 = instance}
                    onOpen={() => this.isVisible4 = true}
                    onClose={() => this.isVisible4 = false}
                    defaultValue={this.gender}
                    zIndex={4}
                    placeholder="Select Gender"
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
                    dropDownStyle={{ backgroundColor: COLORS.WHITE_COLOR }}
                    onChangeItem={item => {
                        this.isVisible4 = false
                        this.gender = item.value
                    }}
                    selectedLabelStyle={{
                        color: COLORS.GREY_COLOR,
                        fontSize: FONT.TextNormal,
                        fontFamily: FONT_FAMILY.MontserratRegular
                    }}
                    activeLabelStyle={{ color: COLORS.APP_THEME_COLOR }}
                    customArrowUp={() => <Image source={AUTH_IMAGES.DROP_DOWN_ICON} resizeMode={'contain'} />}
                    customArrowDown={() => <Image source={AUTH_IMAGES.DROP_DOWN_ICON} resizeMode={'contain'} />}
                />
                <Spacer space={3} />
                {patientType === 0 &&
                    this.renderPhoneInputsView()
                }
                <TextInputHeading>{STRINGS.IS_DIABETIC_TEXT}</TextInputHeading>
                <Spacer space={3} />
                <RadioForm
                    ref={ref => this.radioFormClearD = ref}
                    radio_props={_yesNoOptions}
                    formHorizontal={true}
                    initial={-1}
                    buttonSize={15}
                    labelStyle={{ paddingRight: 80 }}
                    onPress={(value) => {
                        this.isDiabetic = value == 0 ? true : false
                    }}
                />
                <Spacer space={3} />

                <TextInputHeading>{STRINGS.BLOOD_PRESSURE_TEXT}</TextInputHeading>
                <Spacer space={3} />
                <RadioForm
                    ref={ref => this.radioFormClearB = ref}
                    radio_props={_yesNoOptions}
                    formHorizontal={true}
                    initial={-1}
                    buttonSize={15}
                    labelStyle={{ paddingRight: 80 }}
                    onPress={(value) => {
                        this.isBloodPressue = value
                    }}
                />
                <Spacer space={3} />
                <TextInputHeading>{STRINGS.SMOKING_HABITS_TEXT}</TextInputHeading>
                <Spacer space={3} />
                <RadioForm
                    ref={ref => this.radioFormClearS = ref}
                    radio_props={_yesNoOptions}
                    formHorizontal={true}
                    initial={-1}
                    buttonSize={15}
                    labelStyle={{ paddingRight: 80 }}
                    onPress={(value) => {
                        this.isSmoking = value
                    }}
                />
                <Spacer space={3} />
                <TextInputHeading>{STRINGS.DRUG_HISTORY_TEXT}</TextInputHeading>
                <Spacer space={3} />
                <TextAreaContainer>
                    <TextInput style={{
                        flex: 1,
                        color: COLORS.GREY_COLOR,
                        fontSize: FONT.TextNormal,
                        fontFamily: FONT_FAMILY.MontserratRegular
                    }}
                        multiline
                        maxLength={200}
                        scrollEnabled={false}
                        textAlignVertical={"top"}
                        placeholder='Type Something...(upto 200 words)'
                        numberOfLines={4}
                        placeholderTextColor={COLORS.PLACEHOLDERS_COLOR}
                        value={drugHistory}
                        autoCapitalize='none'
                        onChangeText={(text) => {
                            if (text.trim().length === 0) {
                                this.setState({
                                    drugHistory: text.trim()
                                })
                            } else {
                                this.setState({
                                    drugHistory: text
                                })
                            }

                        }}
                        inputStyle={{
                            color: COLORS.GREY_COLOR,
                            fontSize: FONT.TextNormal,
                            fontFamily: FONT_FAMILY.MontserratRegular
                        }}
                    />
                </TextAreaContainer>
                <Spacer space={3} />

                <TextInputHeading>{STRINGS.PAST_DISEASES_TEXT}</TextInputHeading>
                <Spacer space={3} />
                <TextAreaContainer>
                    <TextInput style={{
                        flex: 1,
                        color: COLORS.GREY_COLOR,
                        fontSize: FONT.TextNormal,
                        fontFamily: FONT_FAMILY.MontserratRegular
                    }}
                        multiline
                        maxLength={200}
                        scrollEnabled={false}
                        textAlignVertical={"top"}
                        placeholder='Type Something...(upto 200 words)'
                        numberOfLines={4}
                        placeholderTextColor={COLORS.PLACEHOLDERS_COLOR}
                        value={pastDisease}
                        autoCapitalize='none'
                        onChangeText={(text) => {
                            if (text.trim().length === 0) {
                                this.setState({
                                    pastDisease: text.trim()
                                })
                            } else {
                                this.setState({
                                    pastDisease: text
                                })
                            }
                        }}
                    />
                </TextAreaContainer>
                <Spacer space={3} />
                <TextInputHeading>{STRINGS.SURGERY_COMPLICATIONS_TEXT}</TextInputHeading>
                <Spacer space={3} />
                <TextAreaContainer>
                    <TextInput style={{
                        flex: 1,
                        color: COLORS.GREY_COLOR,
                        fontSize: FONT.TextNormal,
                        fontFamily: FONT_FAMILY.MontserratRegular
                    }}
                        multiline
                        maxLength={200}
                        scrollEnabled={false}
                        textAlignVertical={"top"}
                        placeholder='Type Something...(upto 200 words)'
                        numberOfLines={4}
                        placeholderTextColor={COLORS.PLACEHOLDERS_COLOR}
                        value={surgeryAndComplications}
                        autoCapitalize='none'
                        onChangeText={(text) => {
                            if (text.trim().length === 0) {
                                this.setState({
                                    surgeryAndComplications: text.trim()
                                })
                            } else {
                                this.setState({
                                    surgeryAndComplications: text
                                })
                            }
                        }}
                    />
                </TextAreaContainer>
                <Spacer space={3} />
            </View>
        )
    };

    _renderCardView = () => {
        return (
            <CardContainerStyle>
                <CardHeadingStyle>{STRINGS.PATIENT_DETAILS_TEXT}</CardHeadingStyle>
                <Spacer space={4} />
                <RadioForm
                    radio_props={[
                        { label: 'Add Patient', value: 0 },
                        { label: 'I am Patient', value: 1 },
                    ]}
                    formHorizontal={true}
                    initial={0}
                    buttonSize={15}
                    labelStyle={{ paddingHorizontal: 20 }}
                    onPress={(value) => {
                        this.emergenyContact1 = "+91";
                        this.emergenyContact2 = "+91";

                        this.controller1.selectItem("Select Relation");
                        this.controller2.selectItem("Select Age");
                        this.controller3.selectItem("Select Blood Group");
                        this.controller4.selectItem("Select Gender");

                        this.isDiabetic = null;
                        this.isBloodPressue = null;
                        this.isSmoking = null;
                        this.radioFormClearD.updateIsActiveIndex(-1);
                        this.radioFormClearB.updateIsActiveIndex(-1);
                        this.radioFormClearS.updateIsActiveIndex(-1);

                        this.setState({
                            patientType: value,
                            firstName: "",
                            lastName: "",
                            drugHistory: "",
                            pastDisease: "",
                            surgeryAndComplications: "",
                        })

                    }}
                />
                <Spacer space={4} />
                {this._renderInputText()}
                <ShadowViewContainer style={{ borderRadius: wp("8%") }}>
                    <NewPrimaryButton
                        btnText={STRINGS.NEXT_TEXT}
                        width={56}
                        borderRadius={wp("8%")}
                        verticalPaddingWithText={4}
                        isTextBold={true}
                        onPress={() => this.onNextPress()}
                    />
                </ShadowViewContainer>
                <Spacer space={2} />
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
                        <ScrollContainer keyboardShouldPersistTaps={"handled"}>
                            <MainContainer onTouchEnd={() => {
                                if (this.isVisible1 === true) {
                                    this.controller1.close()
                                }
                                if (this.isVisible2 === true) {
                                    this.controller2.close()
                                }
                                if (this.isVisible3 === true) {
                                    this.controller3.close()
                                }
                                if (this.isVisible4 === true) {
                                    this.controller4.close()
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

const _yesNoOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
];





