import React from "react";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Header } from "react-native-elements";
import {
  FlatList,
  Image,
  Platform,
  StatusBar,
  TouchableOpacity,
  View,
  NativeModules
} from "react-native";

import {
  MainContainer,
  SafeAreaViewContainer,
  ScrollContainer,
} from "../../../utils/BaseStyles";
import BaseClass from "../../../utils/BaseClass";
import {
  COMMON_IMAGES,
  DRAWER_ICONS,
  PATIENT_HOME_SCREEN_IMAGES,
} from "../../../utils/ImagePaths";
import { Spacer } from "../../../components/spacer";
import COLORS from "../../../themes/Colors";
import {
  ImageBackgroundComponent,
  CaloriesBurntContainer,
  TreadmillImage,
  TextContainer,
  GreetingsText,
  CaloriesCountText,
  HeaderImage,
  HeaderText,
  HeaderRightContainer,
  HeadingText,
  ConsultationsContainer,
  ChargesText,
  DateTimeText,
  SpecificationText,
  ListItemCenterContainer,
  ListItemRightContainer,
  NoRecordsFoundContainer,
  NoRecordsFoundText,
} from "./styles";
import STRINGS from "../../../utils/Strings";
import { NewPrimaryButton } from "../../../components/buttons/primaryButton";
import { FONT } from "../../../themes/FontSizes";
import { RatingView } from "../../../components/ratingComponent";
import { ListItemContainer, ListIcon, NameText } from "../commonStyles";
import { connect } from "react-redux";
import {
  ActiveConsltationAction,
  PreviousConsltationAction,
} from "../../../redux/actions/PatientHomeAction";
import AsyncStorage from "@react-native-community/async-storage";
import OrientationLoadingOverlay from "../../../utils/CustomLoader";
import Moment from "moment";
import NoDataFoundComponent from "../../../components/noDataFoundComponent";
import { formatAMPM, getFormattedDate } from "../../../utils/Helper";
import * as _ from "lodash";
import Fitness from "@ovalmoney/react-native-fitness";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { SpecializationsData } from "../../../utils/CommonStaticData";
import { getValueById } from "../../../utils/Helper";
import PatientRatingModel from "./ratingModel";

const permissions = [
  { kind: Fitness.PermissionKinds.Calories, access: Fitness.PermissionAccesses.Write },
  { kind: Fitness.PermissionKinds.Calories, access: Fitness.PermissionAccesses.Read }
];

class PatientHomeScreen extends BaseClass {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: "",
      careTakerId: "",
      search: "",
      activeConsltationList: [],
      previousConsltationList: [],
      userName: "",
      caloriesBurnt: 0,
      isLoading: false,
      isRatingModelVisible: false,
      currentItemCliked: undefined,
      userPicture: ''
    };
  }

  componentDidMount() {
    AsyncStorage.getItem(STRINGS.LOGIN_DATA).then((result) => {
      let userData = JSON.parse(result);
      if (userData !== undefined && userData !== null) {
        this.setState({
          accessToken: userData.token,
          careTakerId: userData.user_data.id,
          userName: userData.user_data.name,
          userPicture: userData.path == "https://afyanetwork.com/storage/images/patient" || userData.path == "https://afyanetwork.com/storage/images/doctor" || userData.path == null ? '' : userData.path
        });
        if (this.isConnected()) {
          this.CallApi(userData.token, userData.user_data.id);
        } else {
          this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION);
        }
      }
    });
    const { navigation } = this.props;
    this._unsubscribe = navigation.addListener("focus", () => {
      this.onFocusFunction();
    });
    try {
      this.enableCaloriesCounter();
    }
    catch (error) {
      console.log(error)
    }
  }
  onFocusFunction = () => {
    AsyncStorage.getItem(STRINGS.LOGIN_DATA).then((result) => {
      let userData = JSON.parse(result);
      if (userData !== undefined && userData !== null) {
        this.setState({
          accessToken: userData.token,
          careTakerId: userData.user_data.id,
          userName: userData.user_data.name,
        });
        if (this.isConnected()) {
          this.CallApi(userData.token, userData.user_data.id);
        } else {
          this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION);
        }
      }
    });
  };

  componentWillUnmount() {
    this._unsubscribe();
  }

  CallApi(token, id) {
    // this.showDialog();    
    this.props.activeConsltationApi({
      token: token,
      careTakerId: id,
    });

    this.props.previousConsltationApi({
      token: token,
      careTakerId: id,
    });
  }

  requestActivityPermission = async () => {
    debugger
    try {
      const result = await check(PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION);
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.warn(
            "This feature is not available (on this device / in this context)"
          );
          break;
        case RESULTS.DENIED:
          console.warn(
            "The permission has not been requested / is denied but requestable"
          );
          await request(PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION);
          break;
        case RESULTS.GRANTED:
          console.warn("The permission is granted");
          break;
        case RESULTS.BLOCKED:
          console.warn("The permission is denied and not requestable anymore");
          break;
        default:
          console.warn("activity permission default case");

      }
    } catch (err) {
      console.warn('activity permission error', err);
    }
  };

  // wherever you subscribe to steps or activity, add requestActivityPermission() if the method returns false
  handleSubscribe = async () => {
    try {
      const subscribedToActivity = await Fitness.subscribeToActivity();
      if (subscribedToActivity) {
      } else {
        await this.requestActivityPermission();
      }
    } catch (e) {
      console.warn('error in fitness', e);
    }
  };

  async enableCaloriesCounter() {

    Fitness.isAuthorized(permissions)
      .then((authorized) => {
        if (!authorized) {
          Fitness.requestPermissions(permissions)
            .then((authorized) => {
              console.log('user authorized', authorized);
              if (authorized)
                this.setCaloriesCount()
            })
            .catch((error) => {
              console.log('error in authorized', error);
            });
        } else {
          this.setCaloriesCount()
        }
      })
      .catch((error) => {
        console.log('error in Fitness auth', error);
      });

    if (Platform.OS === 'android') {
      this.handleSubscribe();
    }

    // let from = new Date(new Date().toISOString().slice(0, 10)).toISOString();
    // let to = new Date().toISOString();
    // let c = await Fitness.getCalories({
    //   startDate: from,
    //   endDate: to,
    //   interval: "days",
    // });
    // this.setState({
    //   caloriesBurnt: c[0].quantity.toFixed(),
    // });

  }

  async setCaloriesCount() {
    let from = new Date(new Date().toISOString().slice(0, 10)).toISOString();
    let to = new Date().toISOString();
    let c = await Fitness.getCalories({
      startDate: from,
      endDate: to,
      interval: "days",
    });
    console.warn('c detail', c)
    this.setState({
      caloriesBurnt: c[0].quantity.toFixed(),
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { activeConsltationResponse } = nextProps.activeConsltationState;
    const { previousConsltationResponse } = nextProps.prevoiusConsltationState;
    this.hideDialog();
    if (
      activeConsltationResponse !== undefined &&
      activeConsltationResponse !== null
    ) {
      if (
        activeConsltationResponse.code === 200 &&
        activeConsltationResponse.status === "success"
      ) {
        this.setState({
          activeConsltationList: _.filter(
            activeConsltationResponse.data,
            (item) => {
              if (
                item.doctor_detail_data === null ||
                item.doctor_user_data === null
              ) {
              } else {
                return item;
              }
            }
          ).reverse(),
        });
        this.hideDialog();
      } else if (activeConsltationResponse.status === 401) {
        this.hideDialog();
        this.setState({ activeConsltationList: [] });
      } else {
        this.hideDialog();
        this.setState({ activeConsltationList: [] });
      }
    }
    if (
      previousConsltationResponse !== undefined &&
      previousConsltationResponse !== null
    ) {
      if (
        previousConsltationResponse.code === 200 &&
        previousConsltationResponse.status === "success"
      ) {
        this.setState({
          previousConsltationList: _.filter(
            previousConsltationResponse.data,
            (item) => {
              if (
                item.doctor_detail_data === null ||
                item.doctor_user_data === null
              ) {
              } else {
                return item;
              }
            }
          ).reverse(),
        });
        this.hideDialog();
      } else if (previousConsltationResponse.status === 401) {
        this.hideDialog();
        this.setState({ previousConsltationList: [] });
      } else {
        this.hideDialog();
        this.setState({ previousConsltationList: [] });
      }
    } else {
      this.hideDialog();
    }
  }

  _renderCustomLoader = () => {
    const { isLoading } = this.state;
    return (
      <OrientationLoadingOverlay visible={isLoading} message="Loading.." />
    );
  };

  rateNowPress(item) {
    const { navigation } = this.props;
    const { navigate } = navigation;
    if (item.user_rating === null) {
      console.log("item is", item)
      navigate("RatingModal", { data: item });
    } else {
      this.showToastAlert("you have already gave rating to the doctor");
    }
  }

  _renderItem = (item, index, consultationType) => {
    const { navigation } = this.props;
    const { navigate } = navigation;
    const { careTakerId, accessToken } = this.state;

    return (
      <TouchableOpacity
        onPress={() => {
          if (consultationType === "Previous") {

          }
          else {
            debugger
            if (item.payment_status !== null && item.payment_status !== undefined) {
              if (item.payment_status === "COMPLETED") {
                navigate("ConsultationChatScreen", {
                  data: item,
                  opponentId: item.doctor_id,
                  userId: careTakerId,
                  token: accessToken,
                });
              }
              else {
                navigate("PaymentScreen", {
                  paymentSender: careTakerId,
                  paymentReceiver: item.doctor_id,
                  request_id: item.id,
                  screen_type: 'consultation',
                  consultation_fees: item.doctor_detail_data.charges
                })
              }
            }
            else {
              navigate("PaymentScreen", {
                paymentSender: careTakerId,
                paymentReceiver: item.doctor_id,
                request_id: item.id,
                screen_type: 'consultation',
                consultation_fees: item.doctor_detail_data.charges
              })
            }
          }
        }}
      >
        <ListItemContainer>
          <ListIcon
            source={
              item.type === "Doctor"
                ? PATIENT_HOME_SCREEN_IMAGES.LIST_DOCTOR_ICON
                : PATIENT_HOME_SCREEN_IMAGES.LIST_DOCTOR_ICON
            }
          />
          <Spacer row={2} />
          <ListItemCenterContainer>
            <NameText>{item.doctor_user_data.name}</NameText>
            <Spacer space={2} />
            <SpecificationText>
              {getValueById(
                SpecializationsData,
                item.doctor_detail_data.specialization
              )}
            </SpecificationText>
            <Spacer space={2} />
            <DateTimeText>
              {getFormattedDate(item.updated_at)}
              {"    "}
              {formatAMPM(item.updated_at)}
            </DateTimeText>
            {consultationType === "Previous" && <Spacer space={2} />}
            {consultationType === "Previous" && item.user_rating !== undefined &&
              <View style={{ flexDirection: 'row' }}>
                <RatingView isDisable={true} size={4.5} rateCount={item.user_rating !== null ? item.user_rating.rating : 0} />
                <Spacer space={2} />
                {item.user_rating === null &&
                  <NewPrimaryButton
                    btnText={"RATE NOW"}
                    width={22}
                    textSize={FONT.TextExtraSmallX}
                    isTextBold={true}
                    verticalPaddingWithText={2}
                    borderRadius={wp("18%")}
                    onPress={() => this.rateNowPress(item)}
                  />
                }
              </View>
            }
          </ListItemCenterContainer>
          <Spacer row={2} />
          <ListItemRightContainer>
            <ChargesText>$ {item.doctor_detail_data.charges}</ChargesText>
          </ListItemRightContainer>
        </ListItemContainer>
      </TouchableOpacity>
    );
  };

  _renderCaloriesBurntView = () => {
    const { caloriesBurnt } = this.state;
    return (
      <CaloriesBurntContainer>
        <TreadmillImage source={PATIENT_HOME_SCREEN_IMAGES.TREADMILL_IMAGE} />
        <Spacer row={1.5} />
        <TextContainer>
          <GreetingsText
          // onPress={() => this.enableCaloriesCounter()}
          >
            Congratulations
          </GreetingsText>
          <Spacer space={0.5} />
          <CaloriesCountText>
            You have Burned {caloriesBurnt} Calories today.
          </CaloriesCountText>
        </TextContainer>
      </CaloriesBurntContainer>
    );
  };

  _renderHeader = () => {
    const { navigation } = this.props;
    const { navigate } = navigation;
    const { userName, userPicture } = this.state;
    return (
      <Header
        backgroundColor={COLORS.WHITE_COLOR}
        statusBarProps={{
          translucent: true,
        }}
        leftComponent={
          <TouchableOpacity
            activeOpacity={1}
            delayPressIn={1}
            style={{ padding: 12 }}
            onPress={() => navigation.openDrawer()}
          >
            <Image source={DRAWER_ICONS.DRAWER_ICON} />
          </TouchableOpacity>
        }
        rightComponent={
          <HeaderRightContainer>
            <HeaderImage source={userPicture === "" ? COMMON_IMAGES.DUMMY_USER_PROFILE_PIC : { uri: userPicture }} />
            <Spacer row={1.5} />
            <HeaderText >{userName}</HeaderText>
          </HeaderRightContainer>
        }
        containerStyle={{
          backgroundColor: COLORS.TRANSPARENT,
          borderBottomColor: COLORS.TRANSPARENT,
          paddingTop: 0,
          height: 65,
        }}
      />
    );
  };

  _renderActiveConsultationsView = () => {
    const { activeConsltationList } = this.state;
    return (
      <ConsultationsContainer>
        <HeadingText>{STRINGS.ACTIVE_CONSULTATIONS_TEXT}</HeadingText>
        <Spacer space={2} />
        {activeConsltationList.length !== 0 ? (
          <FlatList
            scrollEnabled={false}
            data={activeConsltationList}
            renderItem={({ item, index }) =>
              this._renderItem(item, index, "Active")
            }
          />
        ) : (
          <NoDataFoundComponent title={"No active consultations available!"} />
        )}
      </ConsultationsContainer>
    );
  };

  _renderPreviousConsultationsView = () => {
    const { previousConsltationList } = this.state;
    return (
      <ConsultationsContainer>
        <HeadingText>{STRINGS.PREVIOUS_CONSULTATIONS_TEXT}</HeadingText>
        <Spacer space={2} />
        {previousConsltationList.length !== 0 ? (
          <FlatList
            scrollEnabled={false}
            data={previousConsltationList}
            renderItem={({ item, index }) =>
              this._renderItem(item, index, "Previous")
            }
          />
        ) : (
          <NoDataFoundComponent
            title={"No previous consultations available!"}
          />
        )}
      </ConsultationsContainer>
    );
  };

  cancelAction = () => {
    const { isModelVisible } = this.state;
    this.setState({ isRatingModelVisible: false });
  };

  render() {
    const { isRatingModelVisible, isModelVisible } = this.state;
    Moment.locale("en");
    return (
      <SafeAreaViewContainer>
        <ImageBackgroundComponent
          source={PATIENT_HOME_SCREEN_IMAGES.PATIENT_HOME_IMAGE_BACKGROUND}
        >
          {this._renderHeader()}
          <ScrollContainer
            style={{ backgroundColor: COLORS.TRANSPARENT }}
            keyboardShouldPersistTaps={"handled"}
            bounces={false}
          >
            <MainContainer style={{ backgroundColor: COLORS.TRANSPARENT }}>
              <Spacer space={3} />
              {this._renderCaloriesBurntView()}
              <Spacer space={3} />
              {this._renderActiveConsultationsView()}
              {/* {isRatingModelVisible && (
                <PatientRatingModel
                  isModelVisible={isRatingModelVisible}
                  closeModal={() => this.cancelAction()}
                  saveAction={(rating, msz) =>
                    this.saveRatingClick(rating, msz)
                  }
                ></PatientRatingModel>
              )} */}
              <Spacer space={3} />
              {this._renderPreviousConsultationsView()}
              <Spacer space={3} />
            </MainContainer>
            {/*{this._renderCustomLoader()}*/}
          </ScrollContainer>
        </ImageBackgroundComponent>
      </SafeAreaViewContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  activeConsltationState: state.ActiveConsltationReducer,
  prevoiusConsltationState: state.PreviousConsltationReducer,
});

// ----------------------------------------

const mapDispatchToProps = (dispatch) => {
  return {
    activeConsltationApi: (payload) =>
      dispatch(ActiveConsltationAction(payload)),
    previousConsltationApi: (payload) =>
      dispatch(PreviousConsltationAction(payload)),
  };
};

// ----------------------------------------

export default connect(mapStateToProps, mapDispatchToProps)(PatientHomeScreen);
