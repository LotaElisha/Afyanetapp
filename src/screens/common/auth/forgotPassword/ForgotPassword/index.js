import React from "react";
import BaseClass from "../../../../../utils/BaseClass";
import {
    MainContainer,
    SafeAreaViewContainer,
    ScrollContainer,
    ShadowViewContainer
} from "../../../../../utils/BaseStyles";
import COLORS from "../../../../../themes/Colors";
import {Spacer} from "../../../../../components/spacer";
import STRINGS from "../../../../../utils/Strings";
import * as Validations from "../../../../../utils/validations";
import {FONT_FAMILY} from "../../../../../themes/FontFamilies";
import {FONT} from "../../../../../themes/FontSizes";
import {Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, View} from "react-native";
import {AppIconImageComponent, CurvedImageBackground, FillInfoTextComponent} from "../../authComponents";
import {AbsoluteContainer, CardContainerStyle} from "../../authComponents/styles";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import {NewPrimaryButton} from "../../../../../components/buttons/primaryButton";
import {DescriptionText, TitleText, ResendText} from "./styles";
import {Input} from "react-native-elements";
import {connect} from "react-redux";
import AntDesign from "react-native-vector-icons/AntDesign";
import {ForgotPasswordAction} from "../../../../../redux/actions/ForgotPasswordAction";
import OrientationLoadingOverlay from "../../../../../utils/CustomLoader";

class ForgotPassword extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            isLoading: false
        }
    }

    onSubmitPress = () => {
        debugger
        const {email} = this.state;
        if (email.length < 1) {
            this.showToastAlert(STRINGS.EMPTY_EMAIL);
        } else if (!Validations.validateEmail(email)) {
            this.showToastAlert(STRINGS.ENTER_VALID_EMAIL_ADDRESS);
        } else {
            if (this.isConnected()) {
                this.showDialog();
                this.props.forgotPasswordApi({
                    email,
                });
            } else {
                this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
            }
        }
    };

    _renderCardView = () => {
        const {email} = this.state;
        return (
            <CardContainerStyle>
                <TitleText>{STRINGS.FORGOT_PASSWORD_TITLE_TEXT}</TitleText>
                <Spacer space={2.5}/>
                <DescriptionText>We will share a<DescriptionText
                    style={{
                        color: COLORS.APP_THEME_COLOR,
                        fontFamily: FONT_FAMILY.MontserratSemiBold
                    }}> link </DescriptionText>on your email.</DescriptionText>
                <Spacer space={3}/>
                <Input
                    inputContainerStyle={{
                        borderBottomColor: "#DDE7E6",
                        borderBottomWidth: 2,
                        alignItems: "center",
                        width: wp("76%")
                    }}
                    placeholder={"Enter Email Id.."}
                    placeholderTextColor={COLORS.PLACEHOLDERS_COLOR}
                    ref="email"
                    value={email}
                    autoCapitalize='none'
                    onChangeText={(text) => this.setState({
                        email: text
                    })}
                    keyboardType={'email-address'}
                    returnKeyType={"done"}
                    onSubmitEditing={() => {
                        // this.refs.lName.focus()
                    }}
                    inputStyle={{
                        color: COLORS.GREY_COLOR,
                        fontSize: FONT.TextNormal,
                        fontFamily: FONT_FAMILY.MontserratRegular
                    }}
                />
                <Spacer space={3}/>
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
                <Spacer space={1}/>
            </CardContainerStyle>
        )
    };


    componentWillReceiveProps(nextProps, nextContext) {
        const {navigation} = this.props;
        const {forgotResponse} = nextProps.forgotPasswordState;
        if (forgotResponse !== undefined && forgotResponse !== null) {
            this.hideDialog();
            if (forgotResponse.code === 200 && forgotResponse.status === 'success') {
                this.hideDialog();
                this.showToastSucess(forgotResponse.message);
                navigation.pop()
            } else if (forgotResponse.status === 401) {
                this.hideDialog();
                this.showToastAlert(forgotResponse.message);
            } else {
                this.hideDialog();
                this.showToastAlert(forgotResponse.message);
            }
        } else {
            this.hideDialog();
            this.showToastAlert(STRINGS.UNKNOWN_ERROR);
        }
    }

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


const mapStateToProps = state => ({
    forgotPasswordState: state.ForgotPasswordReducer,
});

// ----------------------------------------

const mapDispatchToProps = (dispatch) => {
    return {
        forgotPasswordApi: (payload) => dispatch(ForgotPasswordAction(payload)),
    };
};

// ----------------------------------------

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);

