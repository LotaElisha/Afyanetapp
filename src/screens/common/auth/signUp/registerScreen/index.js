import React from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Input } from "react-native-elements";
import DropDownPicker from "react-native-dropdown-picker";

import BaseClass from "../../../../../utils/BaseClass";
import COLORS from "../../../../../themes/Colors";
import { Spacer } from "../../../../../components/spacer";
import STRINGS from "../../../../../utils/Strings";
import {
  AppIconImageComponent,
  CurvedImageBackground,
  FillInfoTextComponent,
  TextInputHeadingComponent,
} from "../../authComponents";
import { NewPrimaryButton } from "../../../../../components/buttons/primaryButton";
import { FONT } from "../../../../../themes/FontSizes";
import { FONT_FAMILY } from "../../../../../themes/FontFamilies";
import { AUTH_IMAGES } from "../../../../../utils/ImagePaths";
import {
  AbsoluteContainer,
  CardContainerStyle,
  CardHeadingStyle,
} from "../../authComponents/styles";
import {
  MainContainer,
  SafeAreaViewContainer,
  ScrollContainer,
  ShadowViewContainer,
} from "../../../../../utils/BaseStyles";
import {
  validateEmail,
  validatePassword,
} from "../../../../../utils/validations";
import PhoneInput from "../../../../../../local_modules/react-native-phone-input";
import AutoCompleteComponent from "../../../../../components/googlePlacesAutoComplete";
import { CheckUserExistApi } from "../../../../../redux/actions/CheckUserExistAction";
import { SendOtpApi } from "../../../../../redux/actions/OtpAction";
import OrientationLoadingOverlay from "../../../../../utils/CustomLoader";
import AsyncStorage from "@react-native-community/async-storage";
import messaging from "@react-native-firebase/messaging";

export default class RegisterScreen extends BaseClass {
  constructor(props) {
    super(props);
    this.state = {
      userType: "",
      email: "",
      password: "",
      confirmPassword: "",
      isSocial: "no",
      socialType: "",
      socialId: "",
      refreshData: false,
      isLoading: false,
      hasEmail: "no",
      deviceToken: "",
      showPassword1: true,
      showPassword2: true,
    };

    this.isVisible = false;
    this.controller1;
    this.pNumber = "+255";
    this.alternateNumber = "+255";
  }

  componentDidMount = () => {
    const { socialData } = this.props.route.params;
    AsyncStorage.getItem("deviceToken").then((result) => {
      if (result !== undefined && result !== null) {
        this.setState({
          deviceToken: result,
        });
      }
    });
    if (socialData === false) {
    } else {
      this.setState({
        isSocial: "yes",
        socialType: socialData[0].social_profile,
        socialId: socialData[0].social_id,
        // fName: socialData[0].name.indexOf(' ') >= 0 ? socialData[0].name.split(' ').slice(0, -1).join(' ') : socialData[0].name,
        // lName: socialData[0].name.indexOf(' ') >= 0 ? socialData[0].name.split(' ').slice(-1).join(' ') : "",
        email: socialData[0].email,
        hasEmail:
          socialData[0].email === undefined ||
          socialData[0].email === null ||
          socialData[0].email === ""
            ? "no"
            : "yes",
      });
    }
  };

  onRegisterPress = async () => {
    const {
      userType,
      email,
      socialId,
      socialType,
      isSocial,
      password,
      confirmPassword,
      pNumber,
      nationalId,
      deviceToken,
    } = this.state;
    console.log(this.state);
    const { navigate } = this.props.navigation;
    if (userType.length === 0) {
      console.log("check0");
      this.showToastAlert(STRINGS.EMPTY_I_AM_A_FIELD);
    } else if (email.length === 0) {
      console.log("check1");
      this.showToastAlert(STRINGS.EMPTY_EMAIL);
    } else if (!this.phone.isValidNumber()) {
      this.showToastAlert(STRINGS.VALID_PHONE_NUMBER);
    } else if (!validateEmail(email)) {
      console.log("check2");
      this.showToastAlert(STRINGS.VALID_EMAIL);
    } else if (password.length === 0) {
      console.log("check3");
      this.showToastAlert(STRINGS.EMPTY_PASSWORD);
    } else if (!validatePassword(password)) {
      console.log("check4");
      this.showToastAlert(STRINGS.VALID_PASSWORD);
    } else if (confirmPassword.length === 0) {
      console.log("check5");
      this.showToastAlert(STRINGS.EMPTY_CONFIRM_PASSWORD);
    } else if (password !== confirmPassword) {
      console.log("check6");
      this.showToastAlert(STRINGS.CONFIRM_PASSWORD_MISMATCH);
    } else {
      console.log("check9");
      if (this.isConnected()) {
        console.log("check10");
        let fcmT = "";
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log("check11");
          fcmT = await messaging().getToken();
          AsyncStorage.setItem("deviceToken", fcmT);
        } else {
          console.log("check12");
        }
        let registerPayload = {
          user_type: userType.toLowerCase(),
          email: email,
          phone_number: this.phone.getValue(),
          password: password,
          c_password: confirmPassword,
          provider_id: socialId,
          provider_name: socialType,
          is_social_account: isSocial,
          //add token
          deviceToken: fcmT === "" ? deviceToken : fcmT,
        };
        this.showDialog();
        debugger;
        CheckUserExistApi(
          {
            email: email,
            phone_number: this.phone.getValue(),
          },
          (response) => {
            console.log("reach", response, registerPayload);
            this.handleVerifyUserResponse(response, registerPayload);
          }
        );
      } else {
        this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION);
      }
    }
  };

  handleVerifyUserResponse = (response, registerPayload) => {
    debugger;
    if (response !== undefined && response !== null) {
      if (response.code === 200) {
        console.log("fff");
        let formattedPhoneNumber =
          "+" +
          this.phone.getCountryCode() +
          " " +
          this.phone.getValue().slice(this.phone.getCountryCode().length + 1);
        SendOtpApi(
          {
            phone_number: formattedPhoneNumber,
          },
          (response) => {
            console.log(response);
            this.handleSendOtpResponse(
              response,
              registerPayload,
              formattedPhoneNumber
            );
          }
        );
      } else if (response.code === 204) {
        this.hideDialog();
        this.showToastAlert(response.message);
      } else if (response.code === 400) {
        this.hideDialog();
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
        this.hideDialog();
        this.showToastAlert(response.message);
      } else if (response.code === 500) {
        this.hideDialog();
        this.showToastAlert(STRINGS.SERVER_ERROR);
      } else {
        this.hideDialog();
        this.showToastAlert(STRINGS.UNKNOWN_ERROR);
      }
    } else {
      this.showToastAlert(STRINGS.UNKNOWN_ERROR);
      this.hideDialog();
    }
  };

  handleSendOtpResponse = (response, registerPayload, formattedPhoneNumber) => {
    const { navigation } = this.props;
    const { navigate } = navigation;
    if (response !== undefined && response !== null) {
      console.log("meme", response);
      this.hideDialog();
      if (response.body !== undefined) {
        console.log("meme1", response);
        this.showToastSucess(STRINGS.OTP_SENT_SUCCESSFULLY);
        navigate("VerifyOtpScreen", { registerPayload, formattedPhoneNumber });
      } else if (response.code === 204) {
        console.log("meme2", response);
        this.showToastAlert(response.message);
      } else if (response.code === 400) {
        console.log("meme3", response);
        this.showToastAlert(response.message);
      } else if (response.code === 401) {
        console.log("meme4", response);
        this.showToastAlert(response.message);
      } else if (response.code === 500) {
        console.log("meme5", response);
        this.showToastAlert(STRINGS.SERVER_ERROR);
      } else {
        console.log("meme6", response);
        this.showToastAlert(STRINGS.UNKNOWN_ERROR);
      }
    } else {
      console.log("meme7", response);
      this.showToastAlert(STRINGS.UNKNOWN_ERROR);
      this.hideDialog();
    }
  };

  showPassword(type) {
    const { showPassword1, showPassword2 } = this.state;
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
    const {
      refreshData,
      userType,
      isSocial,
      hasEmail,
      pNumber,
      email,
      password,
      confirmPassword,
      showPassword1,
      showPassword2,
    } = this.state;
    return (
      <View style={{ alignItems: "center" }}>
        <Spacer space={3} />
        <TextInputHeadingComponent
          requireStar={true}
          title={STRINGS.I_AM_A_TEXT}
        />
        <DropDownPicker
          items={[
            { label: "Patient", value: "Patient" },
            { label: "Doctor", value: "Doctor" },
          ]}
          controller={(instance) => (this.controller1 = instance)}
          defaultValue={userType}
          onOpen={() => (this.isVisible = true)}
          onClose={() => (this.isVisible = false)}
          containerStyle={{ width: wp("76%") }}
          style={{
            backgroundColor: "transparent",
            paddingLeft: 0,
            paddingRight: wp("1%"),
            paddingBottom: wp("2.5%"),
            paddingTop: wp("3.5%"),
            borderWidth: 0,
            borderBottomColor: "#DDE7E6",
            borderBottomWidth: 2,
          }}
          itemStyle={{
            justifyContent: "flex-start",
          }}
          labelStyle={{
            color: COLORS.GREY_COLOR,
            fontSize: FONT.TextNormal,
            fontFamily: FONT_FAMILY.MontserratRegular,
          }}
          placeholder={STRINGS.SELECT_ITEM}
          dropDownStyle={{ backgroundColor: COLORS.WHITE_COLOR }}
          onChangeItem={(item) => {
            this.isVisible = false;
            this.setState(
              {
                userType: item.value,
              },
              () => this.refs.email.focus()
            );
          }}
          selectedLabelStyle={{
            color: COLORS.GREY_COLOR,
            fontSize: FONT.TextNormal,
            fontFamily: FONT_FAMILY.MontserratRegular,
          }}
          activeLabelStyle={{ color: COLORS.APP_THEME_COLOR }}
          customArrowUp={() => (
            <Image source={AUTH_IMAGES.DROP_DOWN_ICON} resizeMode={"contain"} />
          )}
          customArrowDown={() => (
            <Image source={AUTH_IMAGES.DROP_DOWN_ICON} resizeMode={"contain"} />
          )}
        />
        <Spacer space={3.5} />
        <TextInputHeadingComponent
          requireStar={true}
          title={STRINGS.EMAIL_ID_TEXT}
        />
        <Input
          inputContainerStyle={{
            borderBottomColor: "#DDE7E6",
            borderBottomWidth: 2,
            alignItems: "center",
            width: wp("76%"),
          }}
          placeholder=""
          placeholderTextColor={COLORS.PLACEHOLDERS_COLOR}
          ref="email"
          value={email}
          editable={isSocial === "no" || hasEmail === "no"}
          keyboardType={"email-address"}
          onChangeText={(text) =>
            this.setState({
              email: text.trim(),
            })
          }
          returnKeyType={"next"}
          onSubmitEditing={() => {
            this.phone.focus();
          }}
          inputStyle={{
            color: COLORS.GREY_COLOR,
            fontSize: FONT.TextNormal,
            fontFamily: FONT_FAMILY.MontserratRegular,
          }}
          rightIcon={
            <Image source={AUTH_IMAGES.EMAIL_ICON} resizeMode={"contain"} />
          }
        />
        <TextInputHeadingComponent
          requireStar={true}
          title={STRINGS.MOBILE_NUMBER_TEXT}
        />
        <Input
          inputContainerStyle={{
            borderBottomColor: "#DDE7E6",
            borderBottomWidth: 2,
            alignItems: "center",
            width: wp("76%"),
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
                    fontFamily: FONT_FAMILY.MontserratRegular,
                  }}
                  value={this.pNumber}
                  onSelectCountry={(country) => {
                    this.setState({
                      refreshData: !refreshData,
                    });
                    this.pNumber = "+" + this.phone.getCountryCode();
                  }}
                  onChangePhoneNumber={(num) => {
                    this.pNumber = num;
                  }}
                  onSubmitEditing={(value) => {
                    this.ref.password;
                  }}
                  style={{
                    width: wp("71%"),
                  }}
                />
              </View>
            );
          }}
          rightIcon={
            <Image source={AUTH_IMAGES.PHONE_ICON} resizeMode={"contain"} />
          }
        />
        <TextInputHeadingComponent
          requireStar={true}
          title={STRINGS.PASSWORD_TEXT}
        />
        <Input
          inputContainerStyle={{
            borderBottomColor: "#DDE7E6",
            borderBottomWidth: 2,
            alignItems: "center",
            width: wp("76%"),
          }}
          placeholder=""
          placeholderTextColor={COLORS.PLACEHOLDERS_COLOR}
          ref="password"
          value={password}
          secureTextEntry={showPassword1}
          onChangeText={(text) =>
            this.setState({
              password: text.trim(),
            })
          }
          returnKeyType={"next"}
          onSubmitEditing={() => {
            this.refs.confirmPassword.focus();
          }}
          inputStyle={{
            color: COLORS.GREY_COLOR,
            fontSize: FONT.TextNormal,
            fontFamily: FONT_FAMILY.MontserratRegular,
          }}
          rightIcon={
            <TouchableOpacity onPress={() => this.showPassword(1)}>
              <Image
                source={
                  showPassword1
                    ? AUTH_IMAGES.PASSWORD_ICON
                    : AUTH_IMAGES.SHOW_PASSWORD_ICON
                }
                resizeMode={"contain"}
              />
            </TouchableOpacity>
          }
        />

        <TextInputHeadingComponent
          requireStar={true}
          title={STRINGS.CONFIRM_PASSWORD_TEXT}
        />
        <Input
          inputContainerStyle={{
            borderBottomColor: "#DDE7E6",
            borderBottomWidth: 2,
            alignItems: "center",
            width: wp("76%"),
          }}
          placeholder=""
          placeholderTextColor={COLORS.PLACEHOLDERS_COLOR}
          ref="confirmPassword"
          value={confirmPassword}
          secureTextEntry={showPassword2}
          onChangeText={(text) =>
            this.setState({
              confirmPassword: text,
            })
          }
          returnKeyType={"next"}
          // onSubmitEditing={() => {
          //     this.refs.nationalId.focus()
          // }}
          inputStyle={{
            color: COLORS.GREY_COLOR,
            fontSize: FONT.TextNormal,
            fontFamily: FONT_FAMILY.MontserratRegular,
          }}
          rightIcon={
            <TouchableOpacity onPress={() => this.showPassword(2)}>
              <Image
                source={
                  showPassword2
                    ? AUTH_IMAGES.PASSWORD_ICON
                    : AUTH_IMAGES.SHOW_PASSWORD_ICON
                }
                resizeMode={"contain"}
              />
            </TouchableOpacity>
          }
        />
      </View>
    );
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
        <Spacer space={0.5} />
      </CardContainerStyle>
    );
  };

  _renderCustomLoader = () => {
    const { isLoading } = this.state;
    return (
      <OrientationLoadingOverlay visible={isLoading} message="Loading.." />
    );
  };

  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaViewContainer>
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: COLORS.APP_BACKGROUND_COLOR }}
          behavior={Platform.OS === "ios" ? "padding" : null}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
            }}
          >
            <ScrollContainer
              keyboardShouldPersistTaps={"handled"}
              bounces={false}
            >
              <MainContainer
                onTouchEnd={() => {
                  if (this.isVisible === true) {
                    this.controller1.close();
                  }
                }}
              >
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
    );
  }
}
