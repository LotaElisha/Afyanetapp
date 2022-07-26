import React from "react";
import {
  FlatList,
  Image,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Text,
  Switch,
  TouchableWithoutFeedback,
} from "react-native";
import { Input } from "react-native-elements";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-community/async-storage";
import BaseClass from "../../../utils/BaseClass";
import COLORS from "../../../themes/Colors";
import { AUTH_IMAGES } from "../../../utils/ImagePaths";
import { Spacer } from "../../../components/spacer";
import STRINGS from "../../../utils/Strings";
import { FONT_FAMILY } from "../../../themes/FontFamilies";
import { FONT } from "../../../themes/FontSizes";
import {
  NewPrimaryButton,
  CancelPrimaryButton,
} from "../../../components/buttons/primaryButton";
import {
  AppIconImageComponent,
  CurvedImageBackground,
  FillInfoTextComponent,
  TextInputHeadingComponent,
} from "../../common/auth/authComponents";
import {
  COMMON_IMAGES,
  DRAWER_ICONS,
  PATIENT_HOME_SCREEN_IMAGES,
} from "../../../utils/ImagePaths";
import {
  MainContainer,
  SafeAreaViewContainer,
  ScrollContainer,
  ShadowViewContainer,
} from "../../../utils/BaseStyles";
import {
  AbsoluteContainer,
  CardContainerStyle,
  CardHeadingStyle,
  TextInputHeading,
  CommentHeading,
} from "../../common/auth/authComponents/styles";
import { PleaseLoginText } from "../../common/contactUs/styles";
import { validateEmail } from "../../../utils/validations";
import OrientationLoadingOverlay from "../../../utils/CustomLoader";
import AntDesign from "react-native-vector-icons/AntDesign";
import { ContactUsApi } from "../../../redux/actions/ContactUsAction";
import { Header } from "react-native-elements";
import { RatingView } from "../../../../src/components/ratingComponent";

class ReviewMember extends BaseClass {
  constructor(props) {
    super(props);
    this.state = {
      messageText: "",
      isLoading: false,
      id: "",
      accessToken: "",
      rating: undefined,
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
        console.log(userData);
        this.setState({
          accessToken: userData.token,
          id: userData.user_data.id,
          name: userData.user_data.name,
          email: userData.user_data.email,
        });
      }
    });
  };

  componentWillUnmount() {}

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
    } else {
      if (this.isConnected()) {
        this.showDialog();
        ContactUsApi(
          {
            token: accessToken,
            email: email,
            name: name,
            contact_message: messageText,
          },
          (response) => this.handleContactResponse(response)
        );
      } else {
        this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION);
      }
    }
  };

  handleContactResponse = (response) => {
    debugger;
    this.hideDialog();
    if (response !== undefined && response !== null) {
      if (response.code === 200) {
        console.log(response.data);
        this.hideDialog();
        if (
          response.data !== undefined &&
          response.data !== null &&
          response.data.length !== 0
        ) {
          this.setState({
            messageText: "",
          });
          this.showToastSucess(response.message);
        }
      } else if (response.code === 204) {
        this.hideDialog();
        this.showToastAlert(response.message);
      } else if (response.code === 400) {
        this.hideDialog();
        this.showToastAlert(response.message);
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
      this.hideDialog();
      this.showToastAlert(STRINGS.UNKNOWN_ERROR);
    }
  };

  _renderInputText = () => {
    const { email, name, messageText } = this.state;
    return (
      <View style={{ alignItems: "center" }}>
        <CommentHeading>{STRINGS.ADD_COMMENT}</CommentHeading>
        <Spacer space={3} />
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderColor: COLORS.GREY_BORDER_COLOR,
            borderWidth: 2,
            borderRadius: 10,
            width: wp(76),
            height: hp(18),
          }}
        >
          <TextInput
            style={{
              flex: 1,
              color: COLORS.GREY_COLOR,
              fontSize: FONT.TextNormal,
              fontFamily: FONT_FAMILY.MontserratRegular,
            }}
            multiline
            maxLength={200}
            scrollEnabled={false}
            textAlignVertical={"top"}
            placeholder="Write Something..."
            numberOfLines={4}
            placeholderTextColor={COLORS.PLACEHOLDERS_COLOR}
            value={messageText}
            autoCapitalize="none"
            onChangeText={(text) => {
              if (text.trim().length === 0) {
                this.setState({
                  messageText: text.trim(),
                });
              } else {
                this.setState({
                  messageText: text,
                });
              }
            }}
          />
        </View>
      </View>
    );
  };

  onSaveBtnPress = () => {
    const { messageText, id, accessToken, rating } = this.state;
    console.log("rating is", rating);
    console.log("accessToken", accessToken);
    console.log("messageText", messageText);
  
    if (rating === undefined) {
      this.showToastAlert("please add rating");
    } else {
      this.showToastAlert("rating-----", rating);
    }
  };

  _renderCardView = () => {
    const { navigation } = this.props;

    const { rating } = this.state;
    const { navigate } = navigation;
    return (
      <CardContainerStyle>
        <CardHeadingStyle>{STRINGS.PROVIDE_FEEDBACK}</CardHeadingStyle>
        <Spacer space={0.5} />
        <RatingView
          size={wp("2%")}
          rateCount={0}
          onFinishRating={(rate) => this.setState({ rating: rate })}
        />
        <Spacer space={0.5} />
        {/* <PleaseLoginText>{STRINGS.CONTACT_US_INFO_TEXT}</PleaseLoginText> */}
        <Spacer space={4} />
        {this._renderInputText()}
        <Spacer space={4} />
        <ShadowViewContainer style={{ borderRadius: wp("8%") }}>
          <NewPrimaryButton
            btnText={STRINGS.VIEW_PROFILE_SAVE_BTN_TEXT}
            width={70}
            borderRadius={wp("8%")}
            verticalPaddingWithText={4}
            isTextBold={true}
            onPress={() => this.onSaveBtnPress()}
          />

          <Spacer space={2} />
          <CancelPrimaryButton
            btnText={STRINGS.CANCEL}
            width={70}
            borderRadius={wp("8%")}
            verticalPaddingWithText={4}
            isTextBold={true}
            onPress={() => navigation.pop()}
          />
        </ShadowViewContainer>
      </CardContainerStyle>
    );
  };
  _renderCustomLoader = () => {
    const { isLoading } = this.state;
    return (
      <OrientationLoadingOverlay visible={isLoading} message="Loading.." />
    );
  };

  _renderHeader = () => {
    const { navigation } = this.props;
    return (
      <Header
        backgroundColor={COLORS.WHITE_COLOR}
        barStyle={"dark-content"}
        statusBarProps={{
          translucent: true,
        }}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Image source={DRAWER_ICONS.DRAWER_ICON} />
          </TouchableOpacity>
        }
        centerComponent={{
          text: STRINGS.REVIEW,
          style: {
            color: COLORS.LIGHT_BLACK_COLOR,
            fontSize: FONT.TextNormalX,
            fontFamily: FONT_FAMILY.PoppinsSemiBold,
          },
        }}
        containerStyle={{
          backgroundColor: COLORS.TRANSPARENT,
          borderBottomColor: COLORS.TRANSPARENT,
          paddingTop: 0,
          height: 65,
        }}
      />
    );
  };

  render() {
    const { navigation } = this.props;
    const { navigate } = navigation;
    return (
      <SafeAreaViewContainer>
        {this._renderHeader()}
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: COLORS.APP_THEME_COLOR }}
          behavior={Platform.OS === "ios" ? "padding" : null}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
            }}
          >
            <ScrollContainer
              keyboardShouldPersistTaps={"handled"}
              showsVerticalScrollIndicator={false}
            >
              <MainContainer>
                <CurvedImageBackground />
                <AbsoluteContainer>
                  <Spacer space={3} />
                  <AppIconImageComponent />
                  <FillInfoTextComponent />
                  <Spacer space={2} />
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

export default ReviewMember;
