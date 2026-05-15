import BaseClass from "../../../utils/BaseClass";
import {
  MainContainer,
  SafeAreaViewContainer,
} from "../../../utils/BaseStyles";
import COLORS from "../../../themes/Colors";
import React from "react";
import { Header, SearchBar } from "react-native-elements";
import { FlatList, Image, View, TouchableOpacity, Text } from "react-native";
import {
  DRAWER_ICONS,
  COMMON_IMAGES,
  DOCTOR_MODULE_IMAGES,
  PATIENT_HOME_SCREEN_IMAGES,
} from "../../../utils/ImagePaths";
import { Spacer } from "../../../components/spacer";
import { FONT_FAMILY } from "../../../themes/FontFamilies";
import { FONT } from "../../../themes/FontSizes";
import STRINGS from "../../../utils/Strings";
import { ListItemContainer, NameText } from "../../doctorModule/commonStyles";
import {
  AgeText,
  CenterContainer,
  CompletedConsultationText,
  RightContainer,
  DateTimeText,
  ListIcon,
} from "./styles";
import { connect } from "react-redux";
import { GetNotificationData } from "../../../redux/actions/DoctorConsultationActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import AntDesign from "react-native-vector-icons/AntDesign";

import OrientationLoadingOverlay from "../../../utils/CustomLoader";
import NoDataFoundComponent from "../../../components/noDataFoundComponent";
import Moment from "moment";

class DoctorHistory extends BaseClass {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: "",
      search: "",
      notificationList: [],
      isLoading: false,
      id: "",
      userType: ''
    };
  }

  componentDidMount() {
    AsyncStorage.getItem(STRINGS.LOGIN_DATA).then((result) => {
      let userData = JSON.parse(result);
      if (userData !== undefined && userData !== null) {
        this.setState({
          accessToken: userData.token,
          id: userData.id,
          userType: userData.user_data.user_type
        });
        if (this.isConnected()) {
          this.showDialog()
          GetNotificationData(
            {
              id: userData.additional_details.user_id,
              token: userData.token,
            },
            (response) => this.notificationResponseHandler(response)
          );
        } else {
          this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION);
        }
      }
    });
  }
  notificationResponseHandler = (response) => {
    debugger;
    const { navigation } = this.props;
    if (response !== undefined && response !== null) {
      this.hideDialog();
      if (response.code === 200) {
        this.hideDialog();
        this.setState({ notificationList: response.data });
        // this.showToastSucess(response.message);
      } else if (response.code === 204) {
        this.hideDialog();
        this.showToastAlert(response.message);
        this.setState({ historyList: "" });
      } else if (response.code === 400) {
        this.hideDialog();
        this.showToastAlert(response.message);
        this.setState({ historyList: "" });
      } else if (response.code === 401) {
        this.hideDialog();
        this.showToastAlert(response.message);
        this.setState({ historyList: "" });
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
  UNSAFE_componentWillReceiveProps(nextProps, nextContext) { }

  _renderCustomLoader = () => {
    const { isLoading } = this.state;
    return (
      <OrientationLoadingOverlay visible={isLoading} message="Loading.." />
    );
  };

  _renderItem = (item, index) => {
    return (
      <TouchableOpacity onPress={() => this.handleNotificationPress(item)} >
        <ListItemContainer>
          <View
            style={{
              width: wp("2%"),
              height: wp("20%"),
              backgroundColor:
                item.type === "doctor"
                  ? COLORS.APP_THEME_COLOR
                  : COLORS.ACTIVE_TOGGLE_COLOR,
            }}
          />
          <Spacer row={1.5} />
          <Image
            style={{
              height: wp("20%"),
              width: wp("20%"),
              resizeMode: "contain",

            }}
            source={PATIENT_HOME_SCREEN_IMAGES.DR_IMG}
          />
          <Spacer row={2} />
          <CenterContainer>
            <Text
              style={{
                color: COLORS.PLACEHOLDERS_COLOR,
                fontSize: FONT.TextSmallX,
                fontFamily: FONT_FAMILY.PoppinsSemiBold,
              }}>{item.message_body}</Text>
            <Spacer space={1} />
            <Text style={{
              color: COLORS.PLACEHOLDERS_COLOR,
              fontSize: FONT.TextSmall,
              fontFamily: FONT_FAMILY.PoppinsSemiBold,
              alignSelf: 'flex-end',
            }}>
              {Moment(item.updated_at).format("d MMM YY    h:mm a")}
            </Text>
            <Spacer space={1} />
          </CenterContainer>
        </ListItemContainer>
      </TouchableOpacity>
    );
  };
  handleNotificationPress = (item) => {
    const { navigation } = this.props;
    const { accessToken, userType } = this.state
    if (userType !== 'doctor') {
      switch (item.sender_type) {
        case 'pharmacy':
          navigation.navigate("PharmacyDetails",
            {
              id: item.sender_id,
              token: accessToken,
              prescription_Id: item.prescription_id,
              user_Id: item.receiver_id
            })
          break;
        case 'lab':
          navigation.navigate("LabDetails",
            {
              id: item.sender_id,
              token: accessToken,
              prescription_Id: item.prescription_id,
              user_Id: item.receiver_id
            })
          break;
        case 'doctor':
          if (item.title == 'Request accepted.' && item.payment_status == null) {
            console.warn(item.request_id,item.payment_status)
            navigation.navigate("PaymentScreen", {
              paymentSender: item.receiver_id,
              paymentReceiver: item.sender_id,
              request_id: item.request_id,
              screen_type: 'consultation',
              consultation_fees: item.doctor_charges
            })
          }
          else if (item.title == 'Request accepted.' && item.payment_status != null) {
            this.showToastSucess('You have already paid consultation fee ');
          }
          break
        default:
          break;
      }
    }
    else {
      switch (item.title) {
        case 'Patient Request ':
          navigation.navigate("NewRequest")
          break;
        default:
          break;
      }
    }

  }

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
          text: "Notification",
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
          height: 60,
        }}
      />
    );
  };

  render() {
    Moment.locale("en");
    const { notificationList } = this.state;
    return (
      <SafeAreaViewContainer>
        {this._renderHeader()}
        <MainContainer style={{ backgroundColor: COLORS.WHITE_COLOR }}>
          {/* <Spacer space={2} /> */}
          {notificationList.length !== 0 ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={notificationList}
              renderItem={({ item, index }) => this._renderItem(item, index)}
            />
          ) : (
            <NoDataFoundComponent title={"No Notification available!"} />
          )}
        </MainContainer>
        {this._renderCustomLoader()}
      </SafeAreaViewContainer>
    );
  }
}

export default DoctorHistory;
