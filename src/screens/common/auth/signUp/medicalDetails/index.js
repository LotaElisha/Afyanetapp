import React from "react";
import { Header, Input, CheckBox } from "react-native-elements"
import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Image, View, TextInput, Alert } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import ImagePicker from 'react-native-image-crop-picker';

import BaseClass from "../../../../../utils/BaseClass";
import {
    MainContainer,
    SafeAreaViewContainer,
    ScrollContainer,
    ShadowViewContainer
} from "../../../../../utils/BaseStyles";
import COLORS from "../../../../../themes/Colors";
import { TitleText, TextAreaContainer, DocumentBackground, InvisibleButton, UploadText } from "./styles";
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
import { AbsoluteContainer, CardContainerStyle } from "../../authComponents/styles";
import { SpecializationsData } from "../../../../../utils/CommonStaticData";
import { RegisterDoctorDetailsApi } from "../../../../../redux/actions/SignUpAction";
import OrientationLoadingOverlay from "../../../../../utils/CustomLoader";
import AsyncStorage from "@react-native-community/async-storage";
import AntDesign from "react-native-vector-icons/AntDesign";
import * as _ from "lodash";
import { ConnectycubeAuthServices } from "../../../../../utils/services";

export default class MedicalDetails extends BaseClass {

    constructor(props) {
        super(props);
        this.state = {
            deviceToken: "",
            id: "",
            isIntern: false,
            specialization: "",
            certificates: "",
            passport: "",
            residence: '',
            workPermit: '',
            about: "",
            qualificationDetails: "",
            chargeBy: "",
            charges: "",
            isLoading: false,
            nationality: ''
        };

        this.isVisible2 = false;
        this.controller2;
        this.isVisible = false;
        this.isVisible3 = false;
        this.controller1;
        this.controller3;
        this.specialisationData = _.cloneDeep(SpecializationsData);
        this.specialisationData.shift();
    }

    componentDidMount = () => {
        const { route } = this.props;
        const { data } = route.params;
        this.setState({
            id: data.id
        })
        AsyncStorage.getItem("deviceToken").then((result) => {
            if (result !== undefined && result !== null) {
                this.setState({
                    deviceToken: result
                })
            }
        });
    }

    onNextPress = () => {
        const { id, isIntern, specialization, certificates, passport, about, qualificationDetails, chargeBy, charges, nationality, residence, workPermit } = this.state

        if (specialization === "") {
            this.showToastAlert("Specialization field can not be empty.");
        } else if (certificates === "") {
            this.showToastAlert("Medical/ Internship Certificate field can not be empty.");
        } else if (nationality === "") {
            this.showToastAlert("Nationality field can not be empty.");
        } else if (nationality.toLowerCase() === "internationals" && residence === '') {
            this.showToastAlert("Please upload residence permit.");
        }
        else if (nationality.toLowerCase() === "internationals" && workPermit === '') {
            this.showToastAlert("Please upload work permit");
        }
        else if (passport === "") {
            this.showToastAlert("Passport/ Photo field can not be empty.");
        }
        else if (about === "") {
            this.showToastAlert("About field can not be empty.");
        } else if (qualificationDetails === "") {
            this.showToastAlert("Qualification Details field can not be empty.");
        } else if (chargeBy === "") {
            this.showToastAlert("Charge By field can not be empty.");
        } else if (charges === "") {
            this.showToastAlert("Charges field can not be empty.");
        } else if (parseInt(charges) < 1500) {
            this.showToastAlert("Charges must be minimun 1500");
        }
        else {
            if (this.isConnected()) {
                RegisterDoctorDetailsApi({
                    id: id,
                    is_in_tern: isIntern ? 1 : 0,
                    specialization: specialization,
                    certificate: certificates,
                    image: passport,
                    about_info: about,
                    qualification_details: qualificationDetails,
                    charge_by: chargeBy,
                    charges: charges,
                    services_for: nationality,
                    residential_permit: residence,
                    work_permit: workPermit,
                    timestamp: new Date().getTime()
                }, response => this.handleDoctorDetailsResponse(response));
                this.showDialog();
            } else {
                this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
            }

        }
    };

    handleDoctorDetailsResponse = (response) => {
        // const { navigation } = this.props;
        // const { navigate } = navigation;
        const { deviceToken } = this.state;

        if (response !== undefined && response !== null) {
            this.hideDialog()
            if (response.code === 200) {
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

                // navigate("DoctorDrawer")
                //navigate user to payment screen
                this.props.navigation.navigate("PaymentScreen", {
                    paymentSender: response.data.user_data.id,
                    paymentReceiver: 10,
                    request_id: 0,
                    screen_type: 'doctor login',
                    loginData: response.data

                })
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
            this.hideDialog()
            this.showToastAlert(STRINGS.UNKNOWN_ERROR);
        }
    }

    static _renderHeader() {
        return (
            <Header
                barStyle={"dark-content"}
                statusBarProps={{
                    translucent: true,
                    backgroundColor: COLORS.TRANSPARENT,
                }}
                containerStyle={{
                    paddingTop: 0,
                    height: 0,
                }}
            />
        );
    }

    _renderInputText = () => {
        const { isIntern, specialization, certificates, passport, about, qualificationDetails, chargeBy, charges, nationality, residence, workPermit } = this.state;
        return (
            <View style={{ alignItems: "center" }}>
                <TextInputHeadingComponent requireStar={true} title={STRINGS.SPECIALIZATION_TEXT} />
                <DropDownPicker
                    items={this.specialisationData}
                    defaultValue={specialization}
                    onOpen={() => this.isVisible = true}
                    onClose={() => this.isVisible = false}
                    controller={instance => this.controller1 = instance}
                    placeholder="Select"
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
                        this.isVisible = false;
                        this.setState({
                            specialization: item.value
                        })
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
                <TextInputHeadingComponent requireStar={true} title={STRINGS.MEDICAL_CERTIFICATE_TEXT} />
                <DocumentBackground>
                    <InvisibleButton onPress={() => {
                        OpenOptionPopup(image => {
                            //Upload File to server
                            this.setState({ certificates: image })
                        });
                    }}>
                        <Image source={AUTH_IMAGES.UPLOAD_ICON} resizeMode={'contain'} size={10} />
                        <UploadText> {certificates === "" ?
                            "Upload" : "Change"
                        }</UploadText>
                    </InvisibleButton>
                </DocumentBackground>
                <Spacer space={3} />
                <TextInputHeadingComponent requireStar={true} title={"Nationality"} />
                <DropDownPicker
                    items={[
                        { label: 'Tanzanians', value: 'Tanzanians' },
                        { label: 'Internationals', value: 'Internationals' },
                    ]}
                    defaultValue={nationality}
                    onOpen={() => this.isVisible3 = true}
                    onClose={() => this.isVisible3 = false}
                    controller={instance => this.controller3 = instance}
                    placeholder="Select"
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
                        this.isVisible3 = false;
                        this.setState({
                            nationality: item.value
                        })
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
                {
                    nationality.toLowerCase() === "internationals" &&
                    <>
                        <TextInputHeadingComponent requireStar={true} title={"Residence Permit"} />
                        <DocumentBackground>
                            <InvisibleButton onPress={() => {
                                OpenOptionPopup(image => {
                                    //Upload File to server
                                    this.setState({ residence: image })
                                });
                            }}>
                                <Image source={AUTH_IMAGES.UPLOAD_ICON} resizeMode={'contain'} size={10} />
                                <UploadText> {residence === "" ?
                                    "Upload" : "Change"
                                }</UploadText>

                            </InvisibleButton>
                        </DocumentBackground>
                        <Spacer space={3} />
                        <TextInputHeadingComponent requireStar={true} title={'Work Permit'} />
                        <DocumentBackground>
                            <InvisibleButton onPress={() => {
                                OpenOptionPopup(image => {
                                    //Upload File to server
                                    this.setState({ workPermit: image })
                                });
                            }}>
                                <Image source={AUTH_IMAGES.UPLOAD_ICON} resizeMode={'contain'} size={10} />
                                <UploadText> {workPermit === "" ?
                                    "Upload" : "Change"
                                }</UploadText>

                            </InvisibleButton>
                        </DocumentBackground>
                        <Spacer space={3} />
                    </>
                }

                <TextInputHeadingComponent requireStar={true} title={STRINGS.PASSPORT_TEXT} />
                <DocumentBackground>
                    <InvisibleButton onPress={() => {
                        OpenOptionPopup(image => {
                            //Upload File to server
                            this.setState({ passport: image })
                        });
                    }}>
                        <Image source={AUTH_IMAGES.UPLOAD_ICON} resizeMode={'contain'} size={10} />
                        <UploadText> {passport === "" ?
                            "Upload" : "Change"
                        }</UploadText>

                    </InvisibleButton>
                </DocumentBackground>
                <Spacer space={3} />
                <TextInputHeadingComponent requireStar={true} title={STRINGS.ABOUT_TEXT} />
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
                        value={about}
                        autoCapitalize='none'
                        onChangeText={(text) => {
                            if (text.trim().length === 0) {
                                this.setState({
                                    about: text.trim()
                                })
                            } else {
                                this.setState({
                                    about: text
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
                <TextInputHeadingComponent requireStar={true} title={STRINGS.QUALIFICATION_TEXT} />
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
                        value={qualificationDetails}
                        autoCapitalize='none'
                        onChangeText={(text) => {
                            if (text.trim().length === 0) {
                                this.setState({
                                    qualificationDetails: text.trim()
                                })
                            } else {
                                this.setState({
                                    qualificationDetails: text
                                })
                            }
                        }}
                    />
                </TextAreaContainer>
                <Spacer space={3} />

                <TextInputHeadingComponent requireStar={true} title={STRINGS.CHARGEBY_TEXT} />
                <DropDownPicker
                    items={_chargeByOptions}
                    defaultValue={chargeBy}
                    placeholder="Select"
                    controller={instance => this.controller2 = instance}
                    onOpen={() => this.isVisible2 = true}
                    onClose={() => this.isVisible2 = false}
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
                        this.isVisible2 = false;
                        this.setState({
                            chargeBy: item.value
                        })
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
                <TextInputHeadingComponent requireStar={true} title={STRINGS.CHARGES_TEXT} />
                <Input
                    inputContainerStyle={{
                        borderBottomColor: "#DDE7E6",
                        borderBottomWidth: 2,
                        alignItems: "center",
                        width: wp("76%")
                    }}
                    placeholder=''
                    maxLength={6}
                    placeholderTextColor={COLORS.PLACEHOLDERS_COLOR}
                    onChangeText={(text) => this.setState({
                        charges: text.trim(),
                    })}
                    keyboardType={"numeric"}
                    returnKeyType={"done"}
                    inputStyle={{
                        color: COLORS.GREY_COLOR,
                        fontSize: FONT.TextNormal,
                        fontFamily: FONT_FAMILY.MontserratRegular
                    }}
                />
                <Spacer space={3} />

            </View>
        )
    };

    _renderCardView = () => {
        const { isIntern } = this.state
        return (
            <CardContainerStyle>
                <TitleText>{STRINGS.MEDICAL_SCREEN_TITLE}</TitleText>
                <Spacer space={4} />
                <CheckBox
                    containerStyle={{
                        width: wp("76%"),
                        paddingLeft: 0,
                        backgroundColor: COLORS.WHITE_COLOR,
                        borderColor: COLORS.WHITE_COLOR
                    }}
                    title={STRINGS.INTERN}
                    textStyle={{
                        fontWeight: "500",
                        fontFamily: FONT_FAMILY.PoppinsSemiBold,
                        fontSize: FONT.TextNormalX,
                        color: COLORS.BLACK_COLOR
                    }}
                    checkedIcon='radio-btn-active'
                    uncheckedIcon='radio-btn-passive'
                    size={28}
                    iconType={"fontisto"}
                    uncheckedColor={COLORS.LIGHT_APP_THEME_COLOR}
                    checkedColor={COLORS.LIGHT_APP_THEME_COLOR}
                    checked={isIntern}
                    onPress={() => this.setState({ isIntern: !isIntern })}
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
                {MedicalDetails._renderHeader()}
                <KeyboardAvoidingView
                    style={{ flex: 1, backgroundColor: COLORS.APP_BACKGROUND_COLOR }}
                    behavior={(Platform.OS === 'ios') ? 'padding' : null}>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            Keyboard.dismiss()
                        }}>
                        <ScrollContainer keyboardShouldPersistTaps={"handled"}>
                            <MainContainer onTouchEnd={() => {
                                if (this.isVisible === true) {
                                    this.controller1.close()
                                }
                                if (this.isVisible2 === true) {
                                    this.controller2.close()
                                }
                                if (this.isVisible3 === true) {
                                    this.controller3.close()
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
const OpenOptionPopup = (pathResponse) => {
    Alert.alert(
        STRINGS.APP_NAME,
        "Choose an Option",
        [
            {
                text: "Cancel", style: 'cancel'
            },
            {
                text: "Gallery", onPress: () => {
                    ImagePicker.openPicker({
                        width: 300,
                        height: 400,
                        cropping: true
                    }).then(image => {
                        pathResponse(image);
                    });
                }
            },
            {
                text: "Camera", onPress: () => {
                    ImagePicker.openCamera({
                        width: 300,
                        height: 400,
                        cropping: true
                    }).then(image => {
                        pathResponse(image);
                    });
                }
            },
        ],
        { cancelable: false });
}

const _chargeByOptions = [
    { label: 'Per Session', value: 'Per Session' },
    { label: 'Time Period', value: 'Time Period' }
]
