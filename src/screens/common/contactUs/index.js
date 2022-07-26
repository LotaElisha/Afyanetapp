import React from "react";
import {
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,
    Image,
    View,
    Platform,
    TextInput
} from "react-native";
import { Input } from "react-native-elements";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-community/async-storage";
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
    FillInfoTextComponent,
    TextInputHeadingComponent
} from "../auth/authComponents";
import { MainContainer, SafeAreaViewContainer, ScrollContainer, ShadowViewContainer } from "../../../utils/BaseStyles";
import { AbsoluteContainer, CardContainerStyle, CardHeadingStyle, TextInputHeading } from "../auth/authComponents/styles";
import {
    PleaseLoginText,
} from "./styles";
import { validateEmail } from "../../../utils/validations";
import OrientationLoadingOverlay from "../../../utils/CustomLoader";
import AntDesign from "react-native-vector-icons/AntDesign";
import { ContactUsApi } from "../../..//redux/actions/ContactUsAction";

class ContactUS extends BaseClass {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            name: "",
            messageText: '',
            isLoading: false,
            id: "",
            accessToken: ''
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        // const { navigation } = this.props;
        // const { navigate } = navigation;

    }

    componentDidMount = () => {
        AsyncStorage.getItem(STRINGS.LOGIN_DATA).then((result) => {
            let userData = JSON.parse(result);
            if (userData !== undefined && userData !== null) {
                console.log(userData)
                this.setState({
                    accessToken: userData.token,
                    id: userData.user_data.id,
                    name: userData.user_data.name,
                    email: userData.user_data.email,
                });
            }
        });
    };

    componentWillUnmount() {
    }

    onSaveBtnPress = () => {
        const { name, email, messageText, id, accessToken } = this.state;
        const { navigate } = this.props.navigation;
        if (name.length < 1) {
            this.showToastAlert(STRINGS.EMPTY_NAME);
        } else if (email.length < 1) {
            this.showToastAlert(STRINGS.EMPTY_EMAIL);
        } else if (!validateEmail(email)) {
            this.showToastAlert(STRINGS.VALID_EMAIL);
        } else if (messageText.length === 0) {
            this.showToastAlert(STRINGS.EMPTY_CONTACT_MESSAGE);
        }
        else {
            if (this.isConnected()) {
                this.showDialog();
                ContactUsApi({
                    "token": accessToken,
                    "email": email,
                    "name": name,
                    "contact_message": messageText,
                }, response => this.handleContactResponse(response));
            } else {
                this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
            }
        }
    };

    handleContactResponse = (response) => {
        debugger
        this.hideDialog()
        if (response !== undefined && response !== null) {
            if (response.code === 200) {
                console.log(response.data)
                this.hideDialog()
                if (response.data !== undefined && response.data !== null && response.data.length !== 0) {
                    this.setState({
                        messageText:''
                    })
                    this.showToastSucess(response.message)
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
        const { email, name, messageText } = this.state;
        return (
            <View style={{ alignItems: "center" }}>
                <TextInputHeadingComponent requireStar={true} title={STRINGS.CONTACT_US_NAME_TEXT} />
                <Input
                    inputContainerStyle={{
                        borderBottomColor: "#DDE7E6",
                        borderBottomWidth: 2,
                        alignItems: "center",
                        width: wp("76%")
                    }}
                    placeholder={""}
                    placeholderTextColor={COLORS.PLACEHOLDERS_COLOR}
                    ref="Name"
                    value={name}
                    autoCapitalize='none'
                    onChangeText={(text) => {
                        if (text.trim().length === 0) {
                            this.setState({
                                name: text.trim()
                            })
                        } else {
                            this.setState({
                                name: text
                            })
                        }
                    }}
                    returnKeyType={"next"}
                    onSubmitEditing={() => {
                        this.refs.Email.focus()
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
                    ref="Email"
                    value={email}
                    onChangeText={(text) => this.setState({
                        email: text.trim(),
                    })}
                    returnKeyType={"done"}
                    inputStyle={{
                        color: COLORS.GREY_COLOR,
                        fontSize: FONT.TextNormal,
                        fontFamily: FONT_FAMILY.MontserratRegular
                    }}
                    rightIcon={<Image source={AUTH_IMAGES.EMAIL_ICON} resizeMode={'contain'} />}
                />
                <TextInputHeading>{STRINGS.CONTACT_US_MESSAGE_TEXT}</TextInputHeading>
                <Spacer space={3} />
                <View style={{
                    paddingHorizontal: 10,
                    paddingVertical: 3,
                    borderColor: COLORS.GREY_BORDER_COLOR,
                    borderWidth: 2,
                    borderRadius: 10,
                    width: wp(76),
                    height: hp(18)
                }}>
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
                        placeholder='Type Something...'
                        numberOfLines={4}
                        placeholderTextColor={COLORS.PLACEHOLDERS_COLOR}
                        value={messageText}
                        autoCapitalize='none'
                        onChangeText={(text) => {
                            if (text.trim().length === 0) {
                                this.setState({
                                    messageText: text.trim()
                                })
                            } else {
                                this.setState({
                                    messageText: text
                                })
                            }
                        }}
                    />
                </View>
            </View>
        )
    };

    _renderCardView = () => {
        const { navigation } = this.props;
        const { navigate } = navigation;
        return (
            <CardContainerStyle>
                <CardHeadingStyle>{STRINGS.CONTACT_US_TEXT}</CardHeadingStyle>
                <Spacer space={.5} />
                <PleaseLoginText>{STRINGS.CONTACT_US_INFO_TEXT}</PleaseLoginText>
                <Spacer space={4} />
                {this._renderInputText()}
                <Spacer space={4} />
                <ShadowViewContainer style={{ borderRadius: wp("8%") }}>
                    <NewPrimaryButton
                        btnText={"SEND"}
                        width={50}
                        borderRadius={wp("8%")}
                        verticalPaddingWithText={4}
                        isTextBold={true}
                        onPress={() => this.onSaveBtnPress()}
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
    // contactUsState: state.ChangePasswordReducer,
});

const mapDispatchToProps = (dispatch) => {
    return {
        // contactUsApi: (payload) => dispatch(ChangePasswordAction(payload)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactUS);
