import React from "react";
import { TextInput, View, KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback, } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BaseClass from "../../../../utils/BaseClass";
import COLORS from "../../../../themes/Colors";
import { Spacer } from "../../../../components/spacer";
import STRINGS from "../../../../utils/Strings";
import { FONT_FAMILY } from "../../../../themes/FontFamilies";
import { FONT } from "../../../../themes/FontSizes";
import { NewPrimaryButton } from "../../../../components/buttons/primaryButton";
import {
  MainContainer,
  SafeAreaViewContainer,
  ScrollContainer,
  ShadowViewContainer,
} from "../../../../utils/BaseStyles";
import {
  AbsoluteContainer,
  CardContainerStyle,
  CardHeadingStyle,
  TextInputHeading,
  CommentHeading,
} from "../../../common/auth/authComponents/styles";
import OrientationLoadingOverlay from "../../../../utils/CustomLoader";
import { RatingView } from "../../../../components/ratingComponent";
import { PatientRating } from "../../../../redux/actions/PatientRatingAction";
import { RatingFeedback } from "../../../../redux/actions/UpdatePatientDatail";
class PatientRatingModel extends BaseClass {
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
  componentDidMount() {
    const { data } = this.props.route.params;
    console.warn(data)
    console.log("----------mick", data);
    AsyncStorage.getItem(STRINGS.LOGIN_DATA).then((result) => {
      let userData = JSON.parse(result);
      if (userData !== undefined && userData !== null) {
        this.setState({
          accessToken: userData.token,
          id: userData.user_data.id,

        });

      }
    });

  }
  onClosePress = () => {
    const { navigation } = this.props;
    navigation.pop(1);
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
    const { data } = this.props.route.params;
    if (rating === undefined) {
      this.showToastAlert("please add rating");
    } else {
      console.log("rated_by_user_id", id);
      this.showDialog()
      RatingFeedback(
        {
          rated_by_user_id: id,
          rating_for: 'doctor',
          comment: messageText,
          rated_for_user_id: data.doctor_detail_data.user_id,
          rating: rating,
          request_id: data.id,
          token: accessToken,

        },
        (response) => this.ratingResponse(response)
      );

      this.hideDialog();
    }
  };



  _renderCardView = () => {
    const { rating } = this.state;
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
        <Spacer space={4} />
        {this._renderInputText()}
        <Spacer space={4} />
        <View style={{ borderRadius: wp("8%") }}>
          <NewPrimaryButton
            btnText={STRINGS.VIEW_PROFILE_SAVE_BTN_TEXT}
            width={70}
            borderRadius={wp("8%")}
            verticalPaddingWithText={4}
            isTextBold={true}
            onPress={() => this.onSaveBtnPress()}
          />

          <Spacer space={2} />
          <NewPrimaryButton
            btnText={STRINGS.CANCEL}
            width={70}
            color={COLORS.WHITE_COLOR}
            borderRadius={wp("8%")}
            verticalPaddingWithText={4}
            isTextBold={true}
            textColor={COLORS.LIGHT_APP_THEME_COLOR}
            borderColor={COLORS.LIGHT_APP_THEME_COLOR}
            onPress={() => this.onClosePress()}
          />
        </View>
      </CardContainerStyle>
    );
  };
  _renderCustomLoader = () => {
    const { isLoading } = this.state;
    return (
      <OrientationLoadingOverlay visible={isLoading} message="Loading.." />
    );
  };

  ratingResponse = (response) => {
    console.log("response is", response);
    const { navigation } = this.props;
    this.hideDialog();
    this.hideDialog();
    if (response !== undefined && response !== null) {
      if (response.code === 200) {
        this.hideDialog();
        this.showToastSucess(response.message);
        navigation.pop(1);
      } else if (response.code === 204) {
        this.hideDialog();
        this.setState({ isRatingModelVisible: false });
        this.showToastAlert(response.message);
      } else if (response.code === 400) {
        this.hideDialog();
        this.setState({ isRatingModelVisible: false });
        this.showToastAlert(response.message);
      } else if (response.code === 401) {
        this.hideDialog();
        this.setState({ isRatingModelVisible: false });
        this.showToastAlert(response.message);
      } else if (response.code === 500) {
        this.hideDialog();
        this.setState({ isRatingModelVisible: false });
        this.showToastAlert(STRINGS.SERVER_ERROR);
      } else {
        this.hideDialog();
        this.setState({ isRatingModelVisible: false });
        this.showToastAlert(STRINGS.UNKNOWN_ERROR);
      }
    } else {
      this.hideDialog();
      this.setState({ isRatingModelVisible: false });
      this.showToastAlert(STRINGS.UNKNOWN_ERROR);
    }
  };

  render() {
    const { isModelVisible } = this.props;
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: COLORS.TRANSPARENT, }}
        behavior={(Platform.OS === 'ios') ? 'padding' : null}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss()
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: COLORS.MODAL_BACKGROUND_COLOR,
            }}
          >
            <View
              style={{
                width: wp(90),
                borderRadius: wp(1),
                backgroundColor: COLORS.TRANSPARENT,
                justifyContent: "center",
                paddingVertical: wp(4),
                alignItems: "center",
              }}
            >
              {this._renderCardView()}
              <Spacer space={4} />
            </View>
            {this._renderCustomLoader()}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

export default PatientRatingModel;
