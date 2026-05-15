import React from "react";
import { Header } from "react-native-elements";
import {
  FlatList,
  Image,
  Platform,
  TouchableOpacity,
  View,
  Text,
  Switch,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

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
  HeaderRightContainer,
  HeaderText,
  HeadingText,
  ConsultationsContainer,
  ChargesText,
  DateTimeText,
  SpecificationText,
  ListItemCenterContainer,
  ListItemRightContainer,
} from "./styles";
import STRINGS from "../../../utils/Strings";
import { ListItemContainer, ListIcon, NameText } from "../commonStyles";
import {
  GetDoctorStatusApi,
  ChangeDoctorStatusApi,
} from "../../../redux/actions/DoctorStatusActions";
import OrientationLoadingOverlay from "../../../utils/CustomLoader";
import {
  GetDoctorActiveConsultationApi,
  GetDoctorConsultationRequestsApi,
} from "../../../redux/actions/DoctorConsultationActions";
import { formatAMPM, getFormattedDate } from "../../../utils/Helper";
import { FONT_FAMILY } from "../../../themes/FontFamilies";
import { FONT } from "../../../themes/FontSizes";
import NoDataFoundComponent from "../../../components/noDataFoundComponent";
import * as _ from "lodash";
import { RectButton } from "react-native-gesture-handler";
import ConnectyCube from "react-native-connectycube";

export default class DoctorHomeScreen extends BaseClass {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      id: "",
      token: "",
      activeConsultationsData: [],
      requetedConsultationsData: [],
      isLoading: false,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem(STRINGS.LOGIN_DATA)
      .then((result) => {
        let userData = JSON.parse(result);
        if (userData !== undefined && userData !== null) {
          this.setState(
            {
              id: userData.user_data.id,
              token: userData.token,
            },
            () => {
              if (this.isConnected()) {
                this.showDialog();
                this.didMountApis(userData);
              } else {
                this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION);
              }
            }
          );
        }

        const { navigation } = this.props;
        this._unsubscribe = navigation.addListener("focus", () => {
          this.onFocusFunction();
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .done();
  }

  onFocusFunction = () => {
    AsyncStorage.getItem(STRINGS.LOGIN_DATA).then((result) => {
      let userData = JSON.parse(result);
      if (userData !== undefined && userData !== null) {
        this.setState(
          {
            id: userData.user_data.id,
            token: userData.token,
          },
          () => {
            if (this.isConnected()) {
              this.showDialog();
              this.didMountApis(userData);
            } else {
              this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION);
            }
          }
        );
      }
    });
  };

  componentWillUnmount() {
    this._unsubscribe();
  }

  didMountApis = async (userData) => {
    GetDoctorActiveConsultationApi(
      {
        id: userData.user_data.id,
        addressTo: userData.user_data.street_name,
        token: userData.token,
      },
      (response) => this.handleActiveConsultationsData(response)
    );

    GetDoctorConsultationRequestsApi(
      {
        id: userData.user_data.id,
        token: userData.token,
      },
      (response) => this.handleConsultationsRequestResponse(response)
    );

    await GetDoctorStatusApi(
      {
        id: userData.user_data.id,
        token: userData.token,
      },
      (response) => this.handleStatusApiResponse(response, "get")
    );
    this.hideDialog();
  };

  onToggleStatus = (currentStatus) => {
    const { id, token } = this.state;
    if (this.isConnected()) {
      this.showDialog();
      ChangeDoctorStatusApi(
        {
          token: token,
          id: id,
          status: currentStatus === true ? "Inactive" : "active",
        },
        (response) => this.handleStatusApiResponse(response, "change")
      );
      this.setState({
        isActive: !currentStatus,
      });
    } else {
      this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION);
    }
  };

  handleConsultationsRequestResponse = (response) => {
    this.hideDialog();
    if (response !== undefined && response !== null) {
      if (response.code === 200) {
        this.hideDialog();
        if (
          response.data !== undefined &&
          response.data !== null &&
          response.data.length !== 0
        ) {
          this.setState({
            requetedConsultationsData: _.filter(response.data, (item) => {
              if (item.patient_user_data !== null) {
                return item;
              }
            }).reverse(),
          });
        } else {
          this.setState({
            requetedConsultationsData: [],
          });
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

  handleActiveConsultationsData = (response) => {
    this.hideDialog();
    if (response !== undefined && response !== null) {
      if (response.code === 200) {
        this.hideDialog();
        if (
          response.data !== undefined &&
          response.data !== null &&
          response.data.length !== 0
        ) {
          this.setState({
            activeConsultationsData: _.filter(response.data, (item) => {
              if (item.patient_user_data !== null) {
                return item;
              }
            }).reverse(),
          });
        } else {
          this.setState({
            activeConsultationsData: [],
          });
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

  handleStatusApiResponse = (response, responseType) => {
    this.hideDialog();
    if (response !== undefined && response !== null) {
      this.hideDialog();
      if (response.code === 200) {
        if (response.data.length !== 0) {
          this.setState({
            isActive: response.data.status_code == 1 ? true : false,
          });
        } else {
          this.setState({
            isActive: false,
          });
        }
        if (responseType === "change") {
          this.showToastSucess(STRINGS.DOCTOR_CHANGE_STATUS_SUCCESS);
        } else {
        }
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
      this.hideDialog();
      this.showToastAlert(STRINGS.UNKNOWN_ERROR);
    }
  };

  handleOnItemPress = (item, type) => {
    const { navigation } = this.props;
    const { token } = this.state;
    const { navigate } = navigation;

    if (type === "active") {
      if (item.payment_status !== null && item.payment_status !== undefined) {
        if (item.payment_status === "COMPLETED") {
          navigate("ConsultationChatScreen", {
            data: item,
            userId: item.doctor_id,
            opponentId: item.caretaker_id,
            patientId: item.patient_id,
            token: token,
          });
        }
        else {
          //this.showToastSucess('Payment pending by Admin.')
          this.showToastSucess('Consultation fee pending.')
        }
      }
      else {
        this.showToastSucess('Consultation fee pending.')
      }

    } else if (type === "request") {
      navigate("ConsultationScreen", { data: item });
    }
  };

  _renderItem = (item, type) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        delayPressIn={0}
        onPress={() => this.handleOnItemPress(item, type)}
      >
        <ListItemContainer>
          <ListIcon source={PATIENT_HOME_SCREEN_IMAGES.LIST_DOCTOR_ICON} />
          <Spacer row={2} />
          <ListItemCenterContainer>
            <NameText>{item.patient_user_data.name}</NameText>
            <Spacer space={2} />
            <SpecificationText>
              {item.patient_user_data.age} Years
            </SpecificationText>
            <Spacer space={2} />
            {type === "request" ? (
              <DateTimeText>
                {getFormattedDate(item.created_at)}
                {"    "}
                {formatAMPM(item.created_at)}
              </DateTimeText>
            ) : (
              <DateTimeText>
                {getFormattedDate(item.updated_at)}
                {"    "}
                {formatAMPM(item.updated_at)}
              </DateTimeText>
            )}
          </ListItemCenterContainer>
          <Spacer row={1} />
          {/*<ListItemRightContainer>*/}
          {/*    <ChargesText>$250</ChargesText>*/}
          {/*</ListItemRightContainer>*/}
        </ListItemContainer>
      </TouchableOpacity>
    );
  };

  _renderHeader = () => {
    const { isActive } = this.state;
    const { navigation } = this.props;
    return (
      <Header
        backgroundColor={COLORS.WHITE_COLOR}
        statusBarProps={{
          translucent: true,
        }}
        leftComponent={
          <RectButton
            style={{ padding: 12 }}
            onActiveStateChange={(active) => console.warn("ac", active)}
            onPress={() => navigation.openDrawer()}
          >
            <Image source={DRAWER_ICONS.DRAWER_ICON} />
          </RectButton>
        }
        rightComponent={
          <HeaderRightContainer>
            <Switch
              trackColor={{
                false: COLORS.INACTIVE_TOGGLE_COLOR,
                true: COLORS.ACTIVE_TOGGLE_COLOR,
              }}
              thumbColor={isActive ? COLORS.WHITE_COLOR : COLORS.WHITE_COLOR}
              ios_backgroundColor={COLORS.INACTIVE_TOGGLE_COLOR}
              onValueChange={() => {
                this.onToggleStatus(isActive);
              }}
              value={isActive}
            />
            <Spacer row={1.5} />
            <HeaderText
              onPress={() => {
                const payload = JSON.stringify({
                  message: "Alice is calling you",
                  ios_badge: 1,
                });
                console.warn("test");
                const pushParameters = {
                  notification_type: "push",
                  user: { ids: [2192407] }, // recipients.
                  environment: "development",
                  message: ConnectyCube.pushnotifications.base64Encode(payload),
                };

                ConnectyCube.pushnotifications.events
                  .create(pushParameters)
                  .then((result) => { })
                  .catch((error) => { });
              }}
            >
              {isActive ? "Active" : "Inactive"}
            </HeaderText>
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
    const { activeConsultationsData } = this.state;
    return (
      <ConsultationsContainer>
        <HeadingText>{STRINGS.ACTIVE_CONSULTATIONS_TEXT}</HeadingText>
        <Spacer space={2} />
        {activeConsultationsData.length === 0 ? (
          <NoDataFoundComponent title={"No active consultations available!"} />
        ) : (
          <FlatList
            scrollEnabled={false}
            data={activeConsultationsData}
            renderItem={(item) => this._renderItem(item.item, "active")}
          />
        )}
      </ConsultationsContainer>
    );
  };

  _renderRequestsView = () => {
    const { requetedConsultationsData } = this.state;
    return (
      <ConsultationsContainer>
        <HeadingText>{STRINGS.REQUESTS_TEXT}</HeadingText>
        <Spacer space={2} />
        {requetedConsultationsData.length === 0 ? (
          <NoDataFoundComponent title={"No consultation requests available!"} />
        ) : (
          <FlatList
            scrollEnabled={false}
            data={requetedConsultationsData}
            renderItem={(item) => this._renderItem(item.item, "request")}
          />
        )}
      </ConsultationsContainer>
    );
  };

  _renderCustomLoader = () => {
    const { isLoading } = this.state;
    return (
      <OrientationLoadingOverlay visible={isLoading} message="Loading.." />
    );
  };

  render() {
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
              <Spacer space={6} />
              {this._renderActiveConsultationsView()}
              <Spacer space={3} />
              {this._renderRequestsView()}
            </MainContainer>
          </ScrollContainer>
          {this._renderCustomLoader()}
        </ImageBackgroundComponent>
      </SafeAreaViewContainer>
    );
  }
}
