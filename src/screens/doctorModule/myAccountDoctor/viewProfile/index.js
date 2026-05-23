import React from "react";
import { Image, Keyboard, KeyboardAvoidingView, TouchableOpacity, TouchableWithoutFeedback, View, Text, Platform } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Input, Icon } from "react-native-elements";

import BaseClass from "../../../../utils/BaseClass";
import COLORS from "../../../..//themes/Colors";
import { Spacer } from "../../../../components/spacer";
import STRINGS from "../../../../utils/Strings";
import {
    AppIconImageComponent,
    CurvedImageBackground,
    FillInfoTextComponent,
    TextInputHeadingComponent
} from "../../../common/auth/authComponents";
import { NewPrimaryButton } from "../../../../components/buttons/primaryButton";
import { FONT } from "../../../..//themes/FontSizes";
import { FONT_FAMILY } from "../../../../themes/FontFamilies";
import { AUTH_IMAGES } from "../../../../utils/ImagePaths";
import { AbsoluteContainer, CardContainerStyle, CardHeadingStyle } from "../../../common/auth/authComponents/styles";
import {
    MainContainer,
    SafeAreaViewContainer,
    ScrollContainer,
    ShadowViewContainer
} from "../../../../utils/BaseStyles";
import { validateEmail, validatePassword } from "../../../../utils/validations";
import PhoneInput from "../../../..//../local_modules/react-native-phone-input";
import AutoCompleteComponent from "../../../../components/googlePlacesAutoComplete";
import { GetProfileApi, UpdateProfileApi } from "../../../..//redux/actions/GetUpdateProfileAction";
import OrientationLoadingOverlay from "../../../../utils/CustomLoader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    ProfileImage,
} from "../styles";
import { COMMON_IMAGES, DRAWER_ICONS } from "../../../../utils/ImagePaths";
import { OpenOptionPopup } from '../../../../utils/Helper'
import { BASE_URL } from '../../../../redux/constants'

export default class ViewProfile extends BaseClass {
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
            refreshData: false,
            isLoading: false,
            id: '',
            accessToken: '',
            profilePic: '',
            userImage: ''
        };
        this.isVisible = false;
        this.controller1;
        this.pNumber = "";
        this.alternateNumber = "";
    }
    componentDidMount = () => {
        const { navigation } = this.props;
        this._unsubscribe = navigation.addListener("focus", () => {
            this.onFocusFunction();
        });
    };

    onFocusFunction = () => {
        AsyncStorage.getItem(STRINGS.LOGIN_DATA).then((result) => {
            let userData = JSON.parse(result);
            console.warn('logindata', userData)
            if (userData !== undefined && userData !== null) {
                this.setState({
                    accessToken: userData.token,
                    id: userData.user_data.id
                });
                if (this.isConnected()) {
                    this.showDialog()
                    GetProfileApi({
                        id: userData.user_data.id,
                        token: userData.token,
                    }, response => this.handleProfileResponse(response));
                }
                else {
                    this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
                }
            }
        });

    };

    componentWillUnmount() {
        this._unsubscribe();
    }

    onSavePress = () => {
        const { fName, lName, email, pNumber, alternateNumber, nationalId, houseNumber, streetName, wardName, district, region, accessToken, id, userImage } = this.state;
        const { navigate } = this.props.navigation;
        if (fName.trim().length === 0) {
            this.showToastAlert(STRINGS.EMPTY_FIRST_NAME)
        } else if (lName.trim().length === 0) {
            this.showToastAlert(STRINGS.EMPTY_LAST_NAME)
        }
        // else if (this.alternateNumber.length > 3 && !this.aPhone.isValidNumber()) {

        //     this.showToastAlert("Please enter a valid Alternative Number.")
        // }
        else if (houseNumber !== null && houseNumber !== undefined && houseNumber.length < 1) {

            this.showToastAlert(STRINGS.EMPTY_HOUSE_NUMBER)

        } else if (streetName.length < 1) {
            this.showToastAlert(STRINGS.EMPTY_STREET_NAME)
        } else if (district.length < 1) {
            this.showToastAlert(STRINGS.EMPTY_DISTRICT)
        } else if (region.length < 1) {
            this.showToastAlert(STRINGS.EMPTY_REGION)
        } else {
            debugger
            if (this.isConnected()) {
                this.showDialog();
                UpdateProfileApi({
                    id: id,
                    token: accessToken,
                    first_name: fName,
                    last_name: lName,
                    email: email,
                    phone_number: this.pNumber.replace('+', ''),
                    alternative_number: this.alternateNumber.replace('+', ''),
                    national_id: nationalId,
                    house_number: houseNumber,
                    street_name: streetName,
                    ward_name: wardName,
                    region: region,
                    district: district,
                    profile_pic: userImage !== "" ? userImage : null,
                    timestamp: new Date().getTime()
                }, response => this.handleProfileResponse(response));
            }
            else {
                this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
            }
        }

    };

    handleProfileResponse = (response) => {
        debugger
        const { navigation } = this.props;
        this.hideDialog()
        if (response !== undefined && response !== null) {
            if (response.code === 200) {
                console.log('profile response', response)
                this.hideDialog()
                if (response.data !== undefined && response.data !== null && response.data.length !== 0) {
                    if (response.message === 'User updated Successfully.') {
                        this.showToastSucess(response.message)
                        AsyncStorage.setItem(STRINGS.LOGIN_DATA, JSON.stringify(response.data));
                        navigation.pop()

                    }
                    else {
                        if (response.data.alternative_number !== null) {
                            this.alternateNumber = "+" + response.data.alternative_number

                        }
                        const { refreshData } = this.state;
                        debugger
                        this.pNumber = "+" + response.data.phone_number
                        this.setState({
                            fName: response.data.first_name,
                            lName: response.data.last_name,
                            email: response.data.email,
                            nationalId: response.data.national_id,
                            houseNumber: response.data.house_number,
                            streetName: response.data.street_name,
                            wardName: response.data.ward_name,
                            district: response.data.district,
                            region: response.data.region,
                            profilePic: response.data.path == "https://afyanetwork.com/storage/images/patient" || response.data.path == "https://afyanetwork.com/storage/images/doctor" ? '' : response.data.path,
                            refreshData: !refreshData
                        })
                        console.warn('nation id', response.data.national_id)
                    }
                }
            } else if (response.code === 204) {
                this.hideDialog()
                this.showToastAlert(response.message);
            } else if (response.code === 400) {
                this.hideDialog()
                this.showToastAlert(response.message);
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
            this.hideDialog()
            this.showToastAlert(STRINGS.UNKNOWN_ERROR);
        }
    }

    _renderInputText = () => {
        const { refreshData, userType, fName, isSocial, lName, hasEmail, email, pNumber, alternateNumber, password, confirmPassword, nationalId, houseNumber, streetName, wardName, district, region } = this.state;
        return (
            <View style={{ alignItems: "center" }}>
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
                                    disabled={true}
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


                <TextInputHeadingComponent requireStar={userType.toLowerCase() === "patient" ? true : false}
                    title={STRINGS.NATIONAL_ID_TEXT} />
                <Input
                    inputContainerStyle={{
                        borderBottomColor: "#DDE7E6",
                        borderBottomWidth: 2,
                        alignItems: "center",
                        width: wp("76%")
                    }}
                    placeholder=''
                    placeholderTextColor={COLORS.PLACEHOLDERS_COLOR}
                    ref="nationalId"
                    editable={false}
                    value={nationalId}
                    onChangeText={(text) => this.setState({
                        nationalId: text
                    })}
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
                <Text style={{
                    color: COLORS.BLACK_COLOR,
                    fontSize: FONT.TextMedium,
                    fontFamily: FONT_FAMILY.PoppinsRegular,
                    fontWeight: 'bold',
                    justifyContent: 'flex-start',
                    width: wp('76%')

                }}>{STRINGS.VIEW_PROFILE_ADDRESS_DETAILS_TEXT}</Text>
                <Spacer space={3} />
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
        const { profilePic, userImage } = this.state;
        return (
            <CardContainerStyle>
                <CardHeadingStyle>{STRINGS.VIEW_PROFILE_PERSONAL_DETAILS_TEXT}</CardHeadingStyle>
                <Spacer space={2} />
                <View>
                    <Image style={{
                        height: wp("26%"),
                        width: wp("26%"),
                        borderRadius: wp("13%")
                    }}
                        source={profilePic === "" ? COMMON_IMAGES.DUMMY_USER_PROFILE_PIC : { uri: profilePic }} />
                    <Icon
                        color={COLORS.BLACK_COLOR}
                        size={wp(5)}
                        name={'edit'}
                        containerStyle={{
                            backgroundColor: COLORS.WHITE_COLOR_SHADE,
                            position: 'absolute',
                            right: wp('0.5%'),
                            bottom: wp('0%'),
                            borderRadius: wp('5%'),
                            padding: 2
                        }}
                        onPress={() => {
                            OpenOptionPopup(image => {
                                //Upload File to server
                                if (image != '')
                                    this.setState({
                                        profilePic: image.path,
                                        userImage: image
                                    })
                            });
                        }
                        }
                    />
                </View>
                <Spacer space={4} />
                {this._renderInputText()}
                <Spacer space={5} />
                <ShadowViewContainer style={{ borderRadius: wp("8%") }}>
                    <NewPrimaryButton
                        btnText={STRINGS.VIEW_PROFILE_SAVE_BTN_TEXT}
                        width={56}
                        borderRadius={wp("8%")}
                        verticalPaddingWithText={4}
                        isTextBold={true}
                        onPress={() => this.onSavePress()}
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
