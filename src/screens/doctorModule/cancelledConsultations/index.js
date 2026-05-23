import BaseClass from "../../../utils/BaseClass";
import {
  MainContainer,
  SafeAreaViewContainer,
} from "../../../utils/BaseStyles";
import COLORS from "../../../themes/Colors";
import React from "react";
import { Header, SearchBar } from "react-native-elements";
import { FlatList, Image, View, TouchableOpacity } from "react-native";
import {
  DRAWER_ICONS,
  PATIENT_HOME_SCREEN_IMAGES,
} from "../../../utils/ImagePaths";
import { Spacer } from "../../../components/spacer";
import { FONT_FAMILY } from "../../../themes/FontFamilies";
import { FONT } from "../../../themes/FontSizes";
import STRINGS from "../../../utils/Strings";
import { ListIcon, ListItemContainer, NameText } from "../commonStyles";
import {
  AgeText,
  CenterContainer,
  CancelConsultationText,
  RightContainer,
  DateTimeText,
} from "./styles";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import AntDesign from "react-native-vector-icons/AntDesign";

import OrientationLoadingOverlay from "../../../utils/CustomLoader";
import NoDataFoundComponent from "../../../components/noDataFoundComponent";
import { GetConsultationHistoryApi } from "../../../redux/actions/DoctorConsultationActions";

class CanceledConsultation extends BaseClass {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: "",
      search: "",
      historyList: [],
      isLoading: false,
      id: "",
    };
  }

  componentDidMount() {
    AsyncStorage.getItem(STRINGS.LOGIN_DATA).then((result) => {
      let userData = JSON.parse(result);
      if (userData !== undefined && userData !== null) {
        this.setState({
          accessToken: userData.token,
          id: userData.id,
        });
        if (this.isConnected()) {
          const { search, accessToken } = this.state;

          GetConsultationHistoryApi(
            {
              id: userData.user_data.id, //id 60
              searchText: search,
              token: accessToken,
              status: "cancelled",
            },
            (response) => this.getConsultationHistoryApiResponse(response)
          );
        } else {
          this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION);
        }
      }
    });
  }

  getConsultationHistoryApiResponse = (response) => {
    console.log("response===", response);
    const { navigation } = this.props;
    if (response !== undefined && response !== null) {
      this.hideDialog();
      if (response.code === 200) {
        this.hideDialog();
        this.setState({ historyList: response.data });
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

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    // const {getLabsResponse} = nextProps.GetLabsState;
    // if (getLabsResponse !== undefined && getLabsResponse !== null) {
    //     if (getLabsResponse.code === 200 && getLabsResponse.status === 'success') {
    //         this.setState({caanceledList: getLabsResponse.data})
    //         this.hideDialog();
    //     } else if (getLabsResponse.status === 401) {
    //         this.hideDialog();
    //         this.setState({caanceledList: []})
    //     } else {
    //         this.hideDialog();
    //         this.setState({caanceledList: []})
    //     }
    //     this.hideDialog()
    // }
  }

  _renderCustomLoader = () => {
    const { isLoading } = this.state;
    return (
      <OrientationLoadingOverlay visible={isLoading} message="Loading.." />
    );
  };

  _renderItem = (item, index) => {
    return (
      <ListItemContainer>
        <ListIcon source={PATIENT_HOME_SCREEN_IMAGES.LIST_DOCTOR_ICON} />
        <Spacer row={2} />
        <CenterContainer>
          <NameText>{item.name}</NameText>
          <Spacer space={2} />
          <AgeText>{item.age}</AgeText>
          <Spacer space={2} />
          <DateTimeText>{item.date + "  " + item.time}</DateTimeText>
          <Spacer space={2} />
        </CenterContainer>
        <Spacer row={2} />
        <RightContainer>
          <AgeText>{item.charges}</AgeText>
        </RightContainer>
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
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Image source={DRAWER_ICONS.DRAWER_ICON} />
          </TouchableOpacity>
        }
        centerComponent={{
          text: STRINGS.CANCELED_CONSULTATION_TITLE_TEXT,
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

  filterList = (requestData) => {
    return requestData.filter((listItem) =>
      listItem.patient_user_data.name
        .toLowerCase()
        .includes(this.state.search.toLowerCase())
    );
  };

  updateSearch = (searchValue) => {
    this.setState({ search: searchValue });
    const { accessToken } = this.state;
    // if (this.isConnected()) {
    //     this.props.GetHistoryApi({
    //         searchText: searchValue,
    //         token: accessToken
    //     })
    // } else {
    //     this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
    // }
  };

  render() {
    const { caanceledList, historyList } = this.state;
    return (
      <SafeAreaViewContainer>
        {this._renderHeader()}
        {this._renderSearchBar()}
        <Spacer space={1} />
        <CancelConsultationText>
          {STRINGS.CANCELED_CONSULTATION_TEXT}
        </CancelConsultationText>
        <Spacer space={1} />
        <MainContainer style={{ backgroundColor: COLORS.WHITE_COLOR }}>
          <Spacer space={2} />
          {historyList.length !== 0
                        ?
          <FlatList
            showsVerticalScrollIndicator={false}
            data={this.filterList(historyList)}
            renderItem={({ item, index }) => this._renderItem(item, index)}
          />
           :
                        <NoDataFoundComponent title={"No History available!"}/>
                    } 
        </MainContainer>
        {this._renderCustomLoader()}
      </SafeAreaViewContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  // GetLabsState: state.LabsReducer,
});

// ----------------------------------------

const mapDispatchToProps = (dispatch) => {
  return {
    // GetHistoryApi: (payload) => dispatch(GetLabsAction(payload)),
  };
};

// ----------------------------------------

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CanceledConsultation);
