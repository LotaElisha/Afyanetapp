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
import { GetPaymentHistoryApi } from "../../../redux/actions/PaymentHistoryAction";
import AsyncStorage from "@react-native-community/async-storage";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import AntDesign from "react-native-vector-icons/AntDesign";

import OrientationLoadingOverlay from "../../../utils/CustomLoader";
import NoDataFoundComponent from "../../../components/noDataFoundComponent";
import Moment from "moment";

class PaymentHistory extends BaseClass {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: "",
      search: "",
      historyList: [],
      isLoading: false,
      userId: "",
      userType: ''
    };
  }

  componentDidMount() {
    AsyncStorage.getItem(STRINGS.LOGIN_DATA).then((result) => {
      let userData = JSON.parse(result);
      if (userData !== undefined && userData !== null) {
        this.setState({
          accessToken: userData.token,
          userId: userData.user_data.id,
          userType: userData.user_data.user_type
        });
        debugger
        if (this.isConnected()) {
          const { userId, search, userType } = this.state;
          this.showDialog()
          GetPaymentHistoryApi(
            {
              user_id: userId,
              userType: userType,
            },
            (response) => this.historyResponse(response)
          );
        } else {
          this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION);
        }
      }
    });
  }
  historyResponse = (response) => {
    debugger
    console.log("response===", response);
    const { navigation } = this.props;
    if (response !== undefined && response !== null) {
      this.hideDialog();
      if (response.code === 200) {
        this.hideDialog();
        this.setState({ historyList: response.data });
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
  componentWillReceiveProps(nextProps, nextContext) { }

  _renderCustomLoader = () => {
    const { isLoading } = this.state;
    return (
      <OrientationLoadingOverlay visible={isLoading} message="Loading.." />
    );
  };

  _renderItem = (item, index) => {
    const { userType } = this.state;
    return (
      <ListItemContainer>
        <View
          style={{
            width: wp("2%"),
            height: wp("20%"),
            backgroundColor:
              userType.toLowerCase() === "doctor"
                ? COLORS.ACTIVE_TOGGLE_COLOR
                : COLORS.REJECT_REQUEST_COLOR,
          }}
        />
        <Spacer row={2} />
        <View>
          <Text
            style=
            {{
              fontSize: wp('4%'),
              width: wp('80%'),
              FONT_FAMILY: FONT_FAMILY.PoppinsRegular,
            }}
          >{userType.toLowerCase() === "doctor" ? ('Received from ' + item.sender_name) : ('Paid to ' + item.receiver_name)}
            <Spacer row={2} />
            <Text
              style=
              {{
                fontSize: wp('3.5%'),
                FONT_FAMILY: FONT_FAMILY.PoppinsRegular,
                color: userType.toLowerCase() === "doctor" ? COLORS.ACCEPT_REQUEST_COLOR : COLORS.REJECT_REQUEST_COLOR,
              }}
            >{userType.toLowerCase() === "doctor" ? ('+' + item.amount) : ('-' + item.amount)}
            </Text>
          </Text>
          <Spacer space={1} />
          <Text style=
            {{
              color: 'gray',
              alignSelf: 'flex-start',
              fontSize: wp('4%'),
              FONT_FAMILY: FONT_FAMILY.PoppinsRegular,
            }}>
            {item.payment_for +" charges"}
          </Text>
          <Spacer space={1} />
          <Text style=
            {{
              color: 'gray',
              alignSelf: 'flex-start',
              fontSize: wp('4%'),
              FONT_FAMILY: FONT_FAMILY.PoppinsRegular,
            }}>
            {Moment(item.created_at).format("d MMM YY    h:mm a")}
          </Text>
          <Spacer space={2} />
        </View>
      </ListItemContainer>
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
          <AntDesign
            name={"arrowleft"}
            color={COLORS.LIGHT_BLACK_COLOR}
            size={30}
            onPress={() => navigation.pop()} />
        }
        centerComponent={{
          text: "Transaction History",
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
    const { historyList } = this.state;
    return (
      <SafeAreaViewContainer>
        {this._renderHeader()}
        <MainContainer style={{ backgroundColor: COLORS.WHITE_COLOR }}>

          {historyList.length !== 0 ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={historyList}
              renderItem={({ item, index }) => this._renderItem(item, index)}
            />
          ) : (
              <NoDataFoundComponent title={"No History available!"} />
            )}
        </MainContainer>
        {this._renderCustomLoader()}
      </SafeAreaViewContainer>
    );
  }
}

export default PaymentHistory;
