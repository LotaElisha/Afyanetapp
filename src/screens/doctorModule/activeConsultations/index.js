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
import AsyncStorage from "@react-native-community/async-storage";
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
} from "../doctorHome/styles";
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

import {
  AgeText,
  CenterContainer,
  CancelConsultationText,
  RightContainer,

} from "../cancelledConsultations/styles";

export default class ActiveConsultation extends BaseClass {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      id: "",
      token: "",
      activeConsultationsData: [],
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
      })
      .catch((error) => {
        console.log(error);
      })
      .done();
  }

  didMountApis = async (userData) => {
    GetDoctorActiveConsultationApi({
      id: userData.user_data.id,
      token: userData.token,
    }, response => this.handleActiveConsultationsData(response));


    this.hideDialog();
  };

  handleActiveConsultationsData = (response) => {
    this.hideDialog()

    if (response !== undefined && response !== null) {
      if (response.code === 200) {
        this.hideDialog()
        if (response.data !== undefined && response.data !== null && response.data.length !== 0) {
          console.warn("data", response.data)
          this.setState({
            activeConsultationsData: _.filter(response.data, (item) => {
              if (item.patient_user_data !== null) {
                return item
              }
            }).reverse()
          })
        } else {
          this.setState({
            activeConsultationsData: []
          })
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
         // this.showToastSucess('Payment pending by Admin.')
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


  _renderItem = (item, index) => {
    return (
      <TouchableOpacity activeOpacity={1} delayPressIn={0} onPress={() => this.handleOnItemPress(item, 'active')}>

        <ListItemContainer>
          <ListIcon source={PATIENT_HOME_SCREEN_IMAGES.LIST_DOCTOR_ICON} />
          <Spacer row={2} />
          <CenterContainer>
            <NameText>{item.patient_user_data.name}</NameText>
            <Spacer space={2} />
            <SpecificationText>{item.patient_user_data.age} Years</SpecificationText>
            <Spacer space={2} />
            <DateTimeText>{getFormattedDate(item.created_at)}{"    "}{formatAMPM(item.created_at)}</DateTimeText>
            <Spacer space={2} />
          </CenterContainer>
          <Spacer row={2} />
          <RightContainer>
            <AgeText>{item.charges}</AgeText>
          </RightContainer>
        </ListItemContainer>
      </TouchableOpacity>
    )
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
        leftComponent={(
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Image
              source={DRAWER_ICONS.DRAWER_ICON}
            />
          </TouchableOpacity>
        )}
        centerComponent={{
          text: STRINGS.ACTIVE_CONSULTATIONS_TEXT, style: {
            color: COLORS.LIGHT_BLACK_COLOR,
            fontSize: FONT.TextNormalX,
            fontFamily: FONT_FAMILY.PoppinsSemiBold
          }
        }}

        containerStyle={{
          backgroundColor: COLORS.TRANSPARENT,
          borderBottomColor: COLORS.TRANSPARENT,
          paddingTop: 0,
          height: 65,
        }}
      />
    )
  };


  _renderRequestsView = () => {
    const { activeConsultationsData } = this.state;
    return (
      <ConsultationsContainer>
        {/* <HeadingText>{STRINGS.NEW_REQUEST}</HeadingText> */}
        <Spacer space={2} />
        {activeConsultationsData.length === 0 ? (
          <NoDataFoundComponent title={"No consultation requests available!"} />
        ) : (
            <FlatList
              scrollEnabled={false}
              data={activeConsultationsData}
              renderItem={(item, index) => this._renderItem(item.item, index)}
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
    const { caanceledList, activeConsultationsData } = this.state;
    return (
      <SafeAreaViewContainer>
        {/* <ImageBackgroundComponent
            source={PATIENT_HOME_SCREEN_IMAGES.PATIENT_HOME_IMAGE_BACKGROUND}
        > */}
        {this._renderHeader()}
        <ScrollContainer style={{ backgroundColor: COLORS.TRANSPARENT }} keyboardShouldPersistTaps={"handled"}
          bounces={false}>
          <MainContainer style={{ backgroundColor: COLORS.TRANSPARENT }}>


            <Spacer space={3} />
            {this._renderRequestsView()}
          </MainContainer>
        </ScrollContainer>
        {this._renderCustomLoader()}
        {/* </ImageBackgroundComponent> */}
      </SafeAreaViewContainer>
    )
  }
}
