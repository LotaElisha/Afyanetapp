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
  CompletedConsultationText,
  RightContainer,
  DateTimeText,
} from "./styles";
import { connect } from "react-redux";
import { GetConsultationHistoryApi } from "../../../redux/actions/DoctorConsultationActions";
import AsyncStorage from "@react-native-community/async-storage";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import AntDesign from "react-native-vector-icons/AntDesign";
// import {
//     NoRecordsFoundContainer,
//     NoRecordsFoundText
// } from "../pharmacys/styles";

import OrientationLoadingOverlay from "../../../utils/CustomLoader";
import NoDataFoundComponent from "../../../components/noDataFoundComponent";
import Moment from "moment";

class DoctorHistory extends BaseClass {
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
          console.warn("id is", userData.user_data.id);
          this.showDialog()
          GetConsultationHistoryApi(
            {
              id: userData.user_data.id,
              searchText: search,
              token: accessToken,
              status: "completed",
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
  componentWillReceiveProps(nextProps, nextContext) { }

  _renderCustomLoader = () => {
    const { isLoading } = this.state;
    return (
      <OrientationLoadingOverlay visible={isLoading} message="Loading.." />
    );
  };

  _renderItem = (item, index) => {
    return (
      <TouchableOpacity onPress={() => {
        console.warn("care", item)
        this.props.navigation.navigate("ConsultationHistoryDetails", { 
        data: { 
        id: item.id,
        userId: item.caretaker_id
         } })}}>
        <ListItemContainer >
          <ListIcon source={PATIENT_HOME_SCREEN_IMAGES.LIST_DOCTOR_ICON} />
          <Spacer row={2} />
          <CenterContainer>
            {item.patient_user_data !== null ? (
              <View>
                <NameText>{item.patient_user_data.name}</NameText>
                <Spacer space={2} />
                <AgeText>{item.patient_user_data.age + ' years'}</AgeText>
                <Spacer space={2} />
                <DateTimeText>
                  {Moment(item.patient_user_data.created_at).format(
                    "d MMM YY, h:mm:ss a"
                  )}
                </DateTimeText>
                <Spacer space={2} />
              </View>
            ) : (
                console.log("")
              )}
          </CenterContainer>
          <Spacer row={2} />
          <RightContainer>
            <AgeText>{item.charges}</AgeText>
          </RightContainer>
        </ListItemContainer>

      </TouchableOpacity>
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
          text: STRINGS.CONSULTATION_HISTORY_TITLE_TEXT,
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
          placeholderTextColor={COLORS.PLACEHOLDERS_COLOR}
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
  };

  render() {
    Moment.locale("en");
    const { historyList } = this.state;
    return (
      <SafeAreaViewContainer>
        {this._renderHeader()}
        {this._renderSearchBar()}
        <Spacer space={2} />
        {/*<CompletedConsultationText>{STRINGS.CONSULTATION_HISTORY_COMPLETED_TEXT}</CompletedConsultationText>*/}
        <MainContainer style={{ backgroundColor: COLORS.WHITE_COLOR }}>
          <Spacer space={2} />
          {console.log('count', historyList.length)}
          {historyList.length !== 0 ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={this.filterList(historyList)}
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

const mapStateToProps = (state) => ({
});

// ----------------------------------------

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

// ----------------------------------------

export default connect(mapStateToProps, mapDispatchToProps)(DoctorHistory);
