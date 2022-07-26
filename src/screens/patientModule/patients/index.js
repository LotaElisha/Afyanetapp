import BaseClass from "../../../utils/BaseClass";
import COLORS from "../../../themes/Colors";
import React from "react";
import { Header, SearchBar } from "react-native-elements";
import { FlatList, Image, TouchableOpacity, TouchableWithoutFeedback, Keyboard, View, Alert, KeyboardAvoidingView } from "react-native";
import {
  COMMON_IMAGES,
  DRAWER_ICONS,
  PATIENT_HOME_SCREEN_IMAGES,
} from "../../../utils/ImagePaths";
import { Spacer } from "../../../components/spacer";
import { FONT_FAMILY } from "../../../themes/FontFamilies";
import { FONT } from "../../../themes/FontSizes";
import STRINGS from "../../../utils/Strings";
import { ListItemContainer, ListIcon, NameText } from "../commonStyles";
import {
  AgeText,
  CenterContainer,
  RelationText,
  RightComponent,
} from "./styles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AntDesign from "react-native-vector-icons/AntDesign";
import {
  MainContainer,
  SafeAreaViewContainer,
  ScrollContainer,
  ShadowViewContainer,
} from "../../../utils/BaseStyles";
import { NewPrimaryButton } from "../../../components/buttons/primaryButton";
import AsyncStorage from "@react-native-community/async-storage";
import {
  GetPatientApi,
  RemovePatientApi,
} from "../../../redux/actions/GetAndDeletePatientAction";
import NoDataFoundComponent from "../../../components/noDataFoundComponent";
import OrientationLoadingOverlay from "../../../utils/CustomLoader";

export default class PatientsListing extends BaseClass {
  constructor(props) {
    super(props);
    this.state = {
      streetName: "",
      locationLat: "",
      locationLng: "",
      search: "",
      accessToken: "",
      patientsList: [],
      userId: "",
      token: "",
      currentDeleteIndex: undefined,
      loginUserData: undefined,
      isLoading: false,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem(STRINGS.LOGIN_DATA).then((result) => {
      let userData = JSON.parse(result);
      if (userData !== undefined && userData !== null) {
        this.setState({
          userId: userData.user_data.id,
          token: userData.token,
          loginUserData: userData.user_data,
        });
        this.getPatientList(userData);
      }
    });

    const { navigation } = this.props;
    this._unsubscribe = navigation.addListener("focus", () => {
      this.onFocusFunction();
    });
  }
  onFocusFunction = () => {
    AsyncStorage.getItem(STRINGS.LOGIN_DATA).then((result) => {
      let userData = JSON.parse(result);
      if (userData !== undefined && userData !== null) {
        this.setState({
          userId: userData.user_data.id,
          token: userData.token,
        });
        this.getPatientList(userData);
      }
    });
  };

  componentWillUnmount() {
    this._unsubscribe();
  }
  getPatientList = (userData) => {
    if (this.isConnected()) {
      this.showDialog();
      GetPatientApi(
        {
          id: userData.user_data.id,
          token: userData.token,
        },
        (response) => this.patientData(response)
      );
    }
    else {
      this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
    }
  };

  patientData = (response) => {
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
            patientsList: response.data,
          });
        } else {
          this.setState({
            patientsList: [],
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

  _renderItem = (item, index) => {
    return (
      <ListItemContainer>
        <ListIcon source={PATIENT_HOME_SCREEN_IMAGES.LIST_DOCTOR_ICON} />
        <Spacer row={2} />
        <CenterContainer>
          <NameText>
            {item.patient_user_detail.first_name +
              " " +
              item.patient_user_detail.last_name}
          </NameText>
          <Spacer space={2} />
          <RelationText>{item.relation}</RelationText>
          <Spacer space={2} />
          <AgeText>Age - {item.age} years</AgeText>
        </CenterContainer>
        <Spacer row={2} />
        <RightComponent>
          <TouchableOpacity onPress={() => this.onEditBtnClick(item)}>
            <Image source={COMMON_IMAGES.EDIT_ICON} />
          </TouchableOpacity>
          <Spacer row={1} />
          <TouchableOpacity onPress={() => this.onDeleteClick(item, index)}>
            <Image source={COMMON_IMAGES.DELETE_ICON} />
          </TouchableOpacity>
        </RightComponent>
      </ListItemContainer>
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
          <TouchableOpacity
            activeOpacity={1}
            delayPressIn={0}
            style={{ padding: 12 }}
            onPress={() => navigation.openDrawer()}
          >
            <Image source={DRAWER_ICONS.DRAWER_ICON} />
          </TouchableOpacity>
        }
        centerComponent={{
          text: STRINGS.PATIENTS_TEXT,
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

  _renderSearchBar() {
    const { search } = this.state;
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: wp(95),
          flexDirection: "row",
          paddingVertical: wp(1),
          marginVertical: wp(2),
        }}
      >
        <SearchBar
          placeholderTextColor={COLORS.PLACEHOLDER_COLOR}
          placeholder={"search.."}
          onChangeText={this.updateSearch}
          value={search}
          containerStyle={{
            backgroundColor: COLORS.TRANSPARENT,
            borderWidth: 0,
            borderTopWidth: 0,
            borderBottomWidth: 0,
            alignSelf: "center",
          }}
          inputContainerStyle={{
            paddingVertical: 5,
            borderRadius: wp(6),
            height: wp(12),
            backgroundColor: COLORS.LIGHT_BLUE_BACKGROUND_COLOR,
            width: wp("80%"),
            borderColor: COLORS.WHITE_COLOR,
            borderWidth: wp(0.1),
          }}
          searchIcon={false}
        />
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            borderRadius: wp(8),
            height: wp(16),
            backgroundColor: COLORS.APP_THEME_COLOR,
            position: "absolute",
            right: wp(1),
            width: wp(20),
          }}
        >
          <AntDesign name={"search1"} color={COLORS.WHITE_COLOR} size={wp(8)} />
        </View>
      </View>
    );
  }

  updateSearch = (searchValue) => {
    this.setState({ search: searchValue });
  };

  filterList = (requestData) => {
    return requestData.filter((listItem) =>
      listItem.patient_user_detail.first_name
        .toLowerCase()
        .includes(this.state.search.toLowerCase())
    );
  };

  onDeleteClick = (item, index) => {
    Alert.alert(
      "AFYANET",
      "Are you sure you want to delete ?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => this.onDeleteConfirm(item, index) },
      ],
      { cancelable: false }
    );
  };

  onDeleteConfirm = (item, index) => {
    this.setState({ currentDeleteIndex: index });
    const { token } = this.state;
    if (this.isConnected()) {
      this.showDialog();
      RemovePatientApi(
        {
          id: item.patient_user_detail.id,
          token: token,
        },
        (response) => this.deleteResponse(response)
      );
    } else {
      this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
    }

  };

  deleteResponse = (response) => {
    if (response !== undefined && response !== null) {
      if (response.code === 200) {
        this.hideDialog();
        this.showToastSucess("deleted successfully !")
        this.onFocusFunction();
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

  onEditBtnClick = (item) => {
    const { loginUserData } = this.state;
    const { navigate } = this.props.navigation;
    navigate("EditAndAddPatient", { editData: item, });
  };

  onSaveBtnPress = () => {
    const { loginUserData } = this.state;
    const { navigate } = this.props.navigation;
    navigate("EditAndAddPatient", { data: loginUserData });
  };

  render() {
    const { patientsList } = this.state;
    return (
      <SafeAreaViewContainer>
        {this._renderHeader()}
        {this._renderSearchBar()}
        <MainContainer style={{ backgroundColor: COLORS.WHITE_COLOR }}>
          <Spacer space={2} />
          {(patientsList.length !== 0)
            ?
            <FlatList
              showsVerticalScrollIndicator={false}
              data={this.filterList(patientsList)}
              renderItem={({ item, index }) => this._renderItem(item, index)}
            />
            :
            <NoDataFoundComponent title={"No friends available!"} />
          }
          <Spacer space={4} />
          <ShadowViewContainer
            style={{ alignSelf: "center", borderRadius: wp("8%") }}
          >
            <NewPrimaryButton
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
              }}
              btnText={STRINGS.ADD_FRIEND}
              width={70}
              borderRadius={wp("8%")}
              verticalPaddingWithText={4}
              isTextBold={true}
              onPress={() => this.onSaveBtnPress()}
            />
          </ShadowViewContainer>
          <Spacer space={2} />
        </MainContainer>
        {this._renderCustomLoader()}
      </SafeAreaViewContainer>
    );
  }
}
