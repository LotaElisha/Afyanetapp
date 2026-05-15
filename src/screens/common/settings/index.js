import React from "react";
import {
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,
    Image,
    View,
    Platform,
    TouchableOpacity
} from "react-native";
import { Input } from "react-native-elements";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BaseClass from "../../../utils/BaseClass";
import COLORS from "../../../themes/Colors";
import { AUTH_IMAGES } from "../../../utils/ImagePaths";
import { Spacer } from "../../../components/spacer";
import STRINGS from "../../../utils/Strings";
import { FONT_FAMILY } from "../../../themes/FontFamilies";
import { FONT } from "../../../themes/FontSizes";
import { NewPrimaryButton } from "../../../components/buttons/primaryButton";
import {
    AppIconImageComponent,
    CurvedImageBackground,
    FillInfoTextComponent
} from "../auth/authComponents";
import { MainContainer, SafeAreaViewContainer, ScrollContainer, ShadowViewContainer } from "../../../utils/BaseStyles";
import { AbsoluteContainer, CardContainerStyle, CardHeadingStyle, TextInputHeading } from "../auth/authComponents/styles";
import {
    PleaseLoginText,
} from "./styles";
import { ChangePasswordAction } from "../../../redux/actions/ChangePasswordAction";
import { validatePassword } from "../../../utils/validations";
import OrientationLoadingOverlay from "../../../utils/CustomLoader";
import AntDesign from "react-native-vector-icons/AntDesign";

class Settings extends BaseClass {

    constructor(props) {
        super(props);
        this.state = {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            isLoading: false,
            id: "",
            accessToken: '',
            showPassword1: true,
            showPassword2: true,
            showPassword3: true
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        debugger
        const { navigation } = this.props;
        const { navigate } = navigation;
        const { changePasswordResponse } = nextProps.changePasswordState;
        if (changePasswordResponse !== undefined && changePasswordResponse !== null) {
            this.hideDialog();
            if (changePasswordResponse.code === 200) {
                this.hideDialog();
                this.showToastSucess(changePasswordResponse.message);
                navigation.pop()
            } else if (changePasswordResponse.code === 204) {
                this.showToastAlert(changePasswordResponse.message);
            } else if (changePasswordResponse.code === 400) {
                this.showToastAlert(changePasswordResponse.message);
            } else if (changePasswordResponse.code === 401) {
                this.showToastAlert(changePasswordResponse.message);
            } else if (changePasswordResponse.code === 500) {
                this.showToastAlert(STRINGS.SERVER_ERROR);
            } else {
                this.showToastAlert(STRINGS.UNKNOWN_ERROR);
            }
        } else {
            this.hideDialog()
        }
    }

    componentDidMount = () => {
        AsyncStorage.getItem(STRINGS.LOGIN_DATA).then((result) => {
            let userData = JSON.parse(result);
            if (userData !== undefined && userData !== null) {
                console.log(userData)
                this.setState({
                    accessToken: userData.token,
                    id: userData.user_data.id
                });
            }
        });
    };

    componentWillUnmount() {
    }

    onChangeBtnPress = () => {
        const { currentPassword, newPassword, confirmPassword, id, accessToken } = this.state;
        const { navigate } = this.props.navigation;
        if (currentPassword.length === 0) {
            this.showToastAlert(STRINGS.EMPTY_CURRENT_PASSWORD);
        } else if (!validatePassword(currentPassword)) {
            this.showToastAlert(STRINGS.VALID_PASSWORD)
        } else if (newPassword.length === 0) {
            this.showToastAlert(STRINGS.EMPTY_PASSWORD);
        } else if (!validatePassword(newPassword)) {
            this.showToastAlert(STRINGS.VALID_PASSWORD)
        } else if (currentPassword === newPassword) {
            this.showToastAlert(STRINGS.SAME_PASSWORD)
        } else if (confirmPassword.length === 0) {
            this.showToastAlert(STRINGS.EMPTY_REENTER_PASSWORD)
        } else if (!validatePassword(newPassword)) {
            this.showToastAlert(STRINGS.VALID_PASSWORD)
        } else if (newPassword !== confirmPassword) {
            this.showToastAlert(STRINGS.NEW_PASSWORD_MISMATCH)
        } else {
            if (this.isConnected()) {
                this.showDialog();
                this.props.changePasswordApi({
                    "id": id,
                    "token": accessToken,
                    "current_password": currentPassword,
                    "new_password": newPassword,
                    "confirm_new_password": confirmPassword
                });
            } else {
                this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
            }
        }
    };
    showPassword(type) {
        const { showPassword1, showPassword2, showPassword3 } = this.state;
        switch (type) {
            case 1:
                this.setState({ showPassword1: !showPassword1 });
                break;
            case 2:
                this.setState({ showPassword2: !showPassword2 });
                break;
            case 3:
                this.setState({ showPassword3: !showPassword3 });
                break;
        }
    }
    _renderInputText = () => {
        const { currentPassword, newPassword, confirmPassword,showPassword1,showPassword2,showPassword3 } = this.state;
        return (
            <View style={{ alignItems: "center" }}>
                <TextInputHeading>{STRINGS.CURRENT_PASSWORD_TEXT}</TextInputHeading>
                <Input
                    inputContainerStyle={{
                        borderBottomColor: "#DDE7E6",
                        borderBottomWidth: 2,
                        alignItems: "center",
                        width: wp("76%")
                    }}
                    placeholder=''
                    placeholderTextColor={COLORS.PLACEHOLDERS_COLOR}
                    ref="Password"
                    value={currentPassword}
                    onChangeText={(text) => this.setState({
                        currentPassword: text.trim(),
                    })}
                    secureTextEntry={showPassword1}
                    returnKeyType={"done"}
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
                <TextInputHeading>{STRINGS.PASSWORD_TEXT}</TextInputHeading>
                <Input
                    inputContainerStyle={{
                        borderBottomColor: "#DDE7E6",
                        borderBottomWidth: 2,
                        alignItems: "center",
                        width: wp("76%")
                    }}
                    placeholder=''
                    placeholderTextColor={COLORS.PLACEHOLDERS_COLOR}
                    ref="Password"
                    value={newPassword}
                    onChangeText={(text) => this.setState({
                        newPassword: text.trim(),
                    })}
                    secureTextEntry={showPassword2}
                    returnKeyType={"done"}
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
                <TextInputHeading>{STRINGS.REENTER_PASSWORD_TEXT}</TextInputHeading>
                <Input
                    inputContainerStyle={{
                        borderBottomColor: "#DDE7E6",
                        borderBottomWidth: 2,
                        alignItems: "center",
                        width: wp("76%")
                    }}
                    placeholder=''
                    placeholderTextColor={COLORS.PLACEHOLDERS_COLOR}
                    ref="Password"
                    value={confirmPassword}
                    onChangeText={(text) => this.setState({
                        confirmPassword: text.trim(),
                    })}
                    secureTextEntry={showPassword3}
                    returnKeyType={"done"}
                    inputStyle={{
                        color: COLORS.GREY_COLOR,
                        fontSize: FONT.TextNormal,
                        fontFamily: FONT_FAMILY.MontserratRegular
                    }}
                    rightIcon={<TouchableOpacity onPress={() => this.showPassword(3)}>
                        <Image
                            source={showPassword3 ? AUTH_IMAGES.PASSWORD_ICON : AUTH_IMAGES.SHOW_PASSWORD_ICON}
                            resizeMode={'contain'} />
                    </TouchableOpacity>}
                />
            </View>
        )
    };

    _renderCardView = () => {
        const { navigation } = this.props;
        const { navigate } = navigation;
        return (
            <CardContainerStyle>
                <CardHeadingStyle>{STRINGS.CHANGE_PASSWORD_TEXT}</CardHeadingStyle>
                <Spacer space={.5} />
                <PleaseLoginText>{STRINGS.CHANGE_PASSWORD_MSG}</PleaseLoginText>
                <Spacer space={4} />
                {this._renderInputText()}
                <Spacer space={4} />
                <ShadowViewContainer style={{ borderRadius: wp("8%") }}>
                    <NewPrimaryButton
                        btnText={STRINGS.CHANGE_PASSWORD_BTN_TEXT}
                        width={56}
                        borderRadius={wp("8%")}
                        verticalPaddingWithText={4}
                        isTextBold={true}
                        onPress={() => this.onChangeBtnPress()}
                    />
                </ShadowViewContainer>

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
        const { navigate } = navigation;
        return (
            <SafeAreaViewContainer>
                <KeyboardAvoidingView
                    style={{ flex: 1, backgroundColor: COLORS.APP_THEME_COLOR }}
                    behavior={(Platform.OS === 'ios') ? 'padding' : null}>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            Keyboard.dismiss()
                        }}>
                        <ScrollContainer keyboardShouldPersistTaps={'handled'} showsVerticalScrollIndicator={false}>
                            <MainContainer>
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
                                    <Spacer space={7} />
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

const mapStateToProps = state => ({
    changePasswordState: state.ChangePasswordReducer,
});

const mapDispatchToProps = (dispatch) => {
    return {
        changePasswordApi: (payload) => dispatch(ChangePasswordAction(payload)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
