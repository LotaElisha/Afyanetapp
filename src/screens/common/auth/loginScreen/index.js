import React from "react";
import {
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,
    Image,
    View,
    NativeModules,
    Platform,
    TouchableOpacity
} from "react-native";
import { Input } from "react-native-elements";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import {
    GoogleSignin,
} from '@react-native-community/google-signin';
import { LoginManager } from 'react-native-fbsdk';
import { connect } from "react-redux";
import AsyncStorage from "@react-native-community/async-storage";
import { CommonActions } from '@react-navigation/native';

import { twitterService } from "../../../../components/buttons/twitterSigninButton";
import { facebookService } from "../../../../components/buttons/facebookLoginButton";
import { googleService } from "../../../../components/buttons/googleSignInButton";
import { appleServices } from "../../../../components/buttons/appleLoginButton";
import BaseClass from "../../../../utils/BaseClass";
import COLORS from "../../../../themes/Colors";
import { AUTH_IMAGES } from "../../../../utils/ImagePaths";
import { Spacer } from "../../../../components/spacer";
import STRINGS from "../../../../utils/Strings";
import { FONT_FAMILY } from "../../../../themes/FontFamilies";
import { FONT } from "../../../../themes/FontSizes";
import { NewPrimaryButton } from "../../../../components/buttons/primaryButton";
import {
    AppIconImageComponent,
    CurvedImageBackground,
    FillInfoTextComponent
} from "../authComponents";
import { MainContainer, SafeAreaViewContainer, ScrollContainer, ShadowViewContainer } from "../../../../utils/BaseStyles";
import { AbsoluteContainer, CardContainerStyle, CardHeadingStyle, TextInputHeading } from "../authComponents/styles";
import {
    ForgetPasswordText,
    OrText,
    PleaseLoginText,
    RegisterText,
    SocialButtonsContainer,
} from "./styles";
import { SimpleLoginAction, SocialLoginAction } from "../../../../redux/actions/LoginActions";
import { validateEmail } from "../../../../utils/validations";
import OrientationLoadingOverlay from "../../../../utils/CustomLoader";
import { ConnectycubeAuthServices } from "../../../../utils/services"
import ConnectyCube from "react-native-connectycube";
import { SaveConnectCubeDataApi } from "../../../../redux/actions/saveConnectycubeDataAction";
import messaging from '@react-native-firebase/messaging';
import appleAuth, {
    AppleAuthRequestOperation,
    AppleAuthRequestScope,
    AppleAuthCredentialState,
    AppleButton
} from "@invertase/react-native-apple-authentication";
import AntDesign from "react-native-vector-icons/AntDesign";

const { RNTwitterSignIn } = NativeModules;

class LoginScreen extends BaseClass {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            simpleLoginData: undefined,
            socialLoginData: undefined,
            isLoading: false,
            deviceToken: "",
            showPassword: true
        };
        this.facebookData = [];
        this.twitterData = [];
        this.googleData = [];
        this.appleData = [];
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        const { simpleLoginData, socialLoginData, deviceToken } = this.state;
        const { navigation } = this.props;
        const { navigate } = navigation;
        const { loginResponse } = nextProps.simpleLoginState;
        const { socialResponse } = nextProps.socialLoginState;
        this.hideDialog();
        if (loginResponse !== undefined && loginResponse !== null) {
            console.log('login response', loginResponse)
            this.hideDialog();
            if (loginResponse !== simpleLoginData) {
                this.hideDialog();
                this.setState({
                    simpleLoginData: loginResponse
                });
                debugger
                if (loginResponse.code === 200) {
                    this.hideDialog();
                    if (loginResponse.data.additional_details === undefined || loginResponse.data.additional_details === null) {

                        if (loginResponse.data.user_data.user_type.toLowerCase() === "patient" || loginResponse.data.user_data.user_type.toLowerCase() === "caretaker") {
                            navigate("PatientDetailsScreen", { data: loginResponse.data.user_data })
                        } else {
                            navigate("MedicalDetails", { data: loginResponse.data.user_data })
                        }
                    }
                    else if (loginResponse.data.payment_status === undefined || loginResponse.data.payment_status === null) {
                        // AsyncStorage.setItem(STRINGS.LOGIN_DATA, JSON.stringify(loginResponse.data));
                        navigate("PaymentScreen", {
                            paymentSender: loginResponse.data.user_data.id,
                            paymentReceiver: 10,
                            request_id: 0,
                            screen_type: loginResponse.data.user_data.user_type.toLowerCase() === "patient" || loginResponse.data.user_data.user_type.toLowerCase() === "caretaker" ? 'login' : 'doctor login',
                            loginData: loginResponse.data
                        })
                    }
                    else {
                        if (loginResponse.data.payment_status.payment_status === 'COMPLETED') {
                            this.showToastSucess(STRINGS.LOGIN_SUCCESSFUL);
                            let user = {
                                id: loginResponse.data.connect_cube_details.connect_cube_id,
                                email: loginResponse.data.user_data.email,
                                password: "Mind@123",
                            };

                            const _onSuccessLogin = (token) => {
                                loginResponse.data.connectycube_token = token;
                                AsyncStorage.setItem(STRINGS.LOGIN_DATA, JSON.stringify(loginResponse.data));

                                if (loginResponse.data.user_data.user_type.toLowerCase() === "patient" || loginResponse.data.user_data.user_type.toLowerCase() === "caretaker") {
                                    navigation.dispatch(
                                        CommonActions.reset({
                                            index: 0,
                                            routes: [{ name: 'PatientDrawer' }],
                                        })
                                    );
                                } else {
                                    navigation.dispatch(
                                        CommonActions.reset({
                                            index: 0,
                                            routes: [{ name: 'DoctorDrawer' }],
                                        })
                                    );
                                }
                            };

                            const _onErrorLogin = (error) => {
                                console.warn("ConnectyCube login failed:", error);
                                this.showToastAlert("Failed to connect to chat service.");
                            };

                            ConnectycubeAuthServices.login(user, deviceToken)
                                .then(_onSuccessLogin)
                                .catch(_onErrorLogin);
                        }
                        else {
                            navigate("PaymentScreen", {
                                paymentSender: loginResponse.data.user_data.id,
                                paymentReceiver: 10,
                                request_id: 0,
                                screen_type: loginResponse.data.user_data.user_type.toLowerCase() === "patient" || loginResponse.data.user_data.user_type.toLowerCase() === "caretaker" ? 'login' : 'doctor login',
                                loginData: loginResponse.data
                            })
                        }
                    }
                } else if (loginResponse.code === 204) {
                    this.setState({
                        password: '',
                    });
                    this.showToastAlert(loginResponse.message);
                } else if (loginResponse.code === 400) {
                    this.setState({
                        password: '',
                    });
                    if (loginResponse.data.email !== undefined) {
                        this.showToastAlert(loginResponse.data.email[0]);
                    } else if (loginResponse.data.password !== undefined) {
                        this.showToastAlert(loginResponse.data.password[0]);
                    }
                } else if (loginResponse.code === 401) {
                    this.setState({
                        password: '',
                    });
                    this.showToastAlert(loginResponse.message);
                } else if (loginResponse.code === 500) {
                    this.setState({
                        password: '',
                    });
                    this.showToastAlert(STRINGS.SERVER_ERROR);
                } else {
                    this.setState({
                        password: '',
                    });
                    this.showToastAlert(STRINGS.UNKNOWN_ERROR);
                }
            } else {
                this.hideDialog();
            }
        } else {
            this.hideDialog()
        }


        //====================Social Response================//
        if (socialResponse !== undefined) {
            this.hideDialog();
            if (socialResponse !== socialLoginData) {
                this.hideDialog();
                this.setState({
                    socialLoginData: socialResponse
                });
                if (socialResponse.code === 200) {
                    this.hideDialog();
                    if (socialResponse.data.additional_details === undefined || socialResponse.data.additional_details === null) {
                        if (socialResponse.data.user_data.user_type.toLowerCase() === "patient" || socialResponse.data.user_data.user_type.toLowerCase() === "caretaker") {
                            navigate("PatientDetailsScreen", { data: socialResponse.data.user_data })
                        } else {
                            navigate("MedicalDetails", { data: socialResponse.data.user_data })
                        }
                    }
                    else if (socialResponse.data.payment_status === undefined || socialResponse.data.payment_status === null && socialResponse.data.user_data.user_type.toLowerCase() === "patient" || socialResponse.data.user_data.user_type.toLowerCase() === "caretaker") {
                        // AsyncStorage.setItem(STRINGS.LOGIN_DATA, JSON.stringify(socialResponse.data));
                        navigate("PaymentScreen", {
                            paymentSender: socialResponse.data.user_data.id,
                            paymentReceiver: 10,
                            request_id: 0,
                            screen_type: socialResponse.data.user_data.user_type.toLowerCase() === "patient" || socialResponse.data.user_data.user_type.toLowerCase() === "caretaker" ? 'login' : 'doctor login',
                            loginData: socialResponse.data
                        })
                    }
                    else {
                        this.showToastSucess(STRINGS.LOGIN_SUCCESSFUL);

                        let user = {
                            id: socialResponse.data.connect_cube_details.connect_cube_id,
                            email: socialResponse.data.user_data.email,
                            password: "Mind@123",
                        };

                        const _onSuccessLogin = (token) => {
                            socialResponse.data.connectycube_token = token;
                            AsyncStorage.setItem(STRINGS.LOGIN_DATA, JSON.stringify(socialResponse.data));

                            if (socialResponse.data.user_data.user_type.toLowerCase() === "patient" || socialResponse.data.user_data.user_type.toLowerCase() === "caretaker") {
                                navigation.dispatch(
                                    CommonActions.reset({
                                        index: 0,
                                        routes: [{ name: 'PatientDrawer' }],
                                    })
                                );
                            } else {
                                navigation.dispatch(
                                    CommonActions.reset({
                                        index: 0,
                                        routes: [{ name: 'DoctorDrawer' }],
                                    })
                                );
                            }
                        };

                        const _onErrorLogin = (error) => {
                            console.warn("ConnectyCube login failed:", error);
                            this.showToastAlert("Failed to connect to chat service.");
                        };

                        ConnectycubeAuthServices.login(user, deviceToken)
                            .then(_onSuccessLogin)
                            .catch(_onErrorLogin);
                    }
                } else if (socialResponse.code === 204) {
                    this.hideDialog();
                    let socialData = [];
                    if (this.facebookData.length !== 0) {
                        socialData.push({
                            name: this.facebookData.name,
                            email: this.facebookData.email,
                            profilePic: this.facebookData.picture.data.url,
                            social_id: this.facebookData.id,
                            social_profile: "Facebook"
                        });
                    }
                    if (this.twitterData.length !== 0) {
                        this.hideDialog();
                        socialData.push({
                            name: this.twitterData.userName !== null ? this.twitterData.userName : "",
                            email: this.twitterData.email,
                            profilePic: this.twitterData.avatar,
                            social_id: this.twitterData.userID,
                            social_profile: "Twitter"
                        });
                    }
                    if (this.googleData.length !== 0) {
                        this.hideDialog();
                        socialData.push({
                            name: this.googleData.user.name !== null ? this.googleData.user.name : "",
                            email: this.googleData.user.email,
                            profilePic: this.googleData.user.photo,
                            social_id: this.googleData.user.id,
                            social_profile: "Google"
                        });

                    }
                    if (this.appleData.length !== 0) {
                        this.hideDialog();
                        socialData.push({
                            name: this.appleData.name !== null ? this.appleData.name : "",
                            email: this.appleData.email,
                            profilePic: this.appleData.photo,
                            social_id: this.appleData.id,
                            social_profile: "Apple"
                        });
                    }
                    this.hideDialog();
                    navigate("RegisterScreen", {
                        socialData
                    });
                    this.twitterData = [];
                    this.facebookData = [];
                    this.googleData = [];
                    this.appleData = []
                } else if (socialResponse.code === 400) {
                    this.showToastAlert(socialResponse.message);
                } else if (socialResponse.code === 401) {
                    this.showToastAlert(socialResponse.message);
                } else if (socialResponse.code === 500) {
                    this.showToastAlert(STRINGS.SERVER_ERROR);
                } else {
                    this.showToastAlert(STRINGS.UNKNOWN_ERROR);
                }
            } else {
                this.hideDialog();
            }
        } else {
            this.hideDialog();
        }
        this.hideDialog();
    }

    componentDidMount = () => {
        GoogleSignin.configure({
            iosClientId: '450742348040-grjdk0n12h5re2eo89ei045c4elpb4gj.apps.googleusercontent.com'
        });
        AsyncStorage.getItem("deviceToken").then((result) => {
            if (result !== undefined && result !== null) {

                this.setState({
                    deviceToken: result
                })
            }
        });
    };

    componentWillUnmount() {
    }
    showPassword() {
        console.warn('password icon')
        const { showPassword } = this.state;
        this.setState({ showPassword: !showPassword });
    }

    onLoginPress = async () => {
        const { email, password, deviceToken } = this.state;
        const { navigate } = this.props.navigation;
        if (email.length < 1) {
            this.showToastAlert(STRINGS.EMPTY_EMAIL);
        } else if (!validateEmail(email)) {
            this.showToastAlert(STRINGS.VALID_EMAIL);
        } else if (password.length < 1) {
            this.showToastAlert(STRINGS.EMPTY_PASSWORD);
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
                this.showDialog();
                this.props.simpleLoginApi({
                    email,
                    password,
                    deviceToken: fcmT === "" ? deviceToken : fcmT,
                });
            } else {
                this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
            }
        }
    };

    _renderTwitterButton = () => {
        const { deviceToken } = this.state;
        return (
            <View>
                {twitterService.twitterLoginButton((twitterData) => {
                    this.twitterData = twitterData;
                    if (this.isConnected()) {
                        this.showDialog();
                        this.props.socialLoginApi({
                            social_type: "Twitter",
                            social_id: twitterData.userID,
                            deviceToken: deviceToken
                        });
                    } else {
                        this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
                    }
                    RNTwitterSignIn.logOut();
                })}
            </View>
        )
    };

    _renderFacebookButton = () => {
        const { deviceToken } = this.state
        return (
            <View>
                {
                    facebookService.facebookLoginButton(async (fbData) => {
                        this.facebookData = fbData;
                        if (this.isConnected()) {
                            this.showDialog();
                            this.props.socialLoginApi({
                                social_type: "Facebook",
                                social_id: fbData.id,
                                deviceToken: deviceToken
                            });
                        } else {
                            this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
                        }
                        LoginManager.logOut();
                    })
                }
            </View>
        )
    };

    _renderGoogleButton = () => {
        const { deviceToken } = this.state
        return (
            <>
                {
                    googleService.googleLogin((data) => {
                        if (data.code === undefined) {
                            if (data.user.photo !== null) {
                                let photo;
                                photo = data.user.photo.includes("=") ? data.user.photo.substr(0, data.user.photo.indexOf('=')) : data.user.photo;
                                data.user.photo = photo;
                                this.googleData = data;
                            } else {
                                this.googleData = data;
                            }
                            if (this.isConnected()) {
                                this.showDialog();
                                this.props.socialLoginApi({
                                    social_type: "Google",
                                    social_id: data.user.id,
                                    deviceToken: deviceToken
                                })
                            } else {
                                this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
                            }
                        }
                        this.removeSessionFromDevice();
                    })
                }
            </>
        )
    };

    removeSessionFromDevice = () => {
        GoogleSignin.signOut()
            .then(() => {
            })
            .catch(err => {
                console.log(err);
            })
            .done()
    };

    _renderAppleButton = () => {
        return (
            <ShadowViewContainer style={{ shadowRadius: 1 }}>
                <TouchableOpacity
                    onPress={() => this.onAppleButtonPress()}>
                    <View style={{
                        height: 43,
                        width: 43,
                        marginHorizontal:5,
                        borderRadius: 21.5,
                        backgroundColor: COLORS.WHITE_COLOR,
                        justifyContent: 'center',
                        alignItems: 'center',
                        shadowColor: "#000",
                        shadowOffset: {
                        	width: 0,
                        	height: 2,
                        },
                        shadowOpacity: 0.23,
                        shadowRadius: 2.62,

                        elevation: 4,
                    }}>
                        <AntDesign
                            name={"apple1"}
                            color={COLORS.BLACK_COLOR}
                            size={20}
                        />
                    </View>
                </TouchableOpacity>
            </ShadowViewContainer>
        );

    }
    async onAppleButtonPress() {
        const { deviceToken } = this.state
        // performs login request
       try {
            appleAuth.isSupported &&
            appleAuth
                .performRequest({
                    requestedOperation: appleAuth.Operation.LOGIN,
                    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
                })
                .then((appleAuthRequestResponse) => {
                    let { identityToken, email } = appleAuthRequestResponse;
                    console.log('appleAuthRequestResponse', appleAuthRequestResponse)
                    console.log('identityToken', identityToken);
                    console.log('email', email);
                    this.appleData = {
                        email: email,
                        name: "",
                        id: email
                    }
                    if (this.isConnected()) {
                        this.showDialog();
                        this.props.socialLoginApi({
                            social_type: "Apple",
                            social_id: email,
                            deviceToken: deviceToken
                        });
                    } else {
                        this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
                    }
                    //props.sendResponse(appleAuthRequestResponse)
                });
        }
        catch(err){
        console.log(err)
        }

        // get current authentication state for user
        // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
        // const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

        // use credentialState response to ensure the user is authenticated
        // if (credentialState === appleAuth.State.AUTHORIZED) {
        //     // user is authenticated
        //     console.warn('user authenicate')
        // }
    }
    _renderInputText = () => {
        const { email, password, showPassword } = this.state;
        return (
            <View style={{ alignItems: "center" }}>
                <TextInputHeading>{STRINGS.EMAIL_ID_TEXT}</TextInputHeading>
                <Input
                    inputContainerStyle={{
                        borderBottomColor: "#DDE7E6",
                        borderBottomWidth: 2,
                        alignItems: "center",
                        width: wp("76%")
                    }}
                    placeholder={""}
                    placeholderTextColor={COLORS.PLACEHOLDERS_COLOR}
                    ref="Login"
                    value={email}
                    autoCapitalize='none'
                    onChangeText={(text) => this.setState({
                        email: text.trim(),
                    })}
                    keyboardType="email-address"
                    returnKeyType={"next"}
                    onSubmitEditing={() => {
                        this.refs.Password.focus()
                    }}
                    inputStyle={{
                        color: COLORS.GREY_COLOR,
                        fontSize: FONT.TextNormal,
                        fontFamily: FONT_FAMILY.MontserratRegular
                    }}
                    rightIcon={<Image source={AUTH_IMAGES.EMAIL_ICON} resizeMode={'contain'} />}
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
                    value={password}
                    onChangeText={(text) => this.setState({
                        password: text.trim(),
                    })}
                    secureTextEntry={showPassword}
                    returnKeyType={"done"}
                    inputStyle={{
                        color: COLORS.GREY_COLOR,
                        fontSize: FONT.TextNormal,
                        fontFamily: FONT_FAMILY.MontserratRegular
                    }}
                    rightIcon={
                        <TouchableOpacity onPress={() => this.showPassword()}>
                            <Image
                                source={showPassword ? AUTH_IMAGES.PASSWORD_ICON : AUTH_IMAGES.SHOW_PASSWORD_ICON}
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
                <CardHeadingStyle>{STRINGS.HELLO_TEXT}</CardHeadingStyle>
                <Spacer space={.5} />
                <PleaseLoginText>{STRINGS.PLEASE_LOGIN_TEXT}</PleaseLoginText>
                <Spacer space={4} />
                {this._renderInputText()}
                <ForgetPasswordText onPress={() => {
                    navigate("ForgotPassword")
                }}>
                    {STRINGS.FORGET_PASSWORD_TEXT}
                </ForgetPasswordText>
                <Spacer space={4} />
                <ShadowViewContainer style={{ borderRadius: wp("8%") }}>
                    <NewPrimaryButton
                        btnText={STRINGS.LOGIN_TEXT}
                        width={56}
                        borderRadius={wp("8%")}
                        verticalPaddingWithText={4}
                        isTextBold={true}
                        onPress={() => this.onLoginPress()}
                    />
                </ShadowViewContainer>
                <Spacer space={2} />
                <OrText>or</OrText>
            </CardContainerStyle>
        )
    };

    _renderSocialButtons = () => {
        return (
            <SocialButtonsContainer>
                {this._renderGoogleButton()}
                {this._renderFacebookButton()}
                {this._renderTwitterButton()}
                {this._renderAppleButton()}
                {Platform.OS == 'ios' &&
                    this._renderAppleButton()
                }
            </SocialButtonsContainer>
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
                                    <Spacer space={7} />
                                    <AppIconImageComponent />
                                    <FillInfoTextComponent />
                                    <Spacer space={4} />
                                    {this._renderCardView()}
                                    <Spacer space={8} />
                                    {this._renderSocialButtons()}
                                    <Spacer space={2} />
                                    <RegisterText
                                        onPress={() => {
                                            navigate("RegisterScreen", { "socialData": false });
                                        }}
                                    >{STRINGS.DONT_HAVE_ACCOUNT_TEXT} <RegisterText
                                        style={{ color: COLORS.APP_THEME_COLOR }}>{STRINGS.REGISTER_NOW_TEXT}</RegisterText></RegisterText>
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
    socialLoginState: state.SocialLoginReducer,
    simpleLoginState: state.SimpleLoginReducer
});

const mapDispatchToProps = (dispatch) => {
    return {
        socialLoginApi: (payload) => dispatch(SocialLoginAction(payload)),
        simpleLoginApi: (payload) => dispatch(SimpleLoginAction(payload))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
