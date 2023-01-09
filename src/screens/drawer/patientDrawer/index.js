import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from "react-native";
import { connect } from "react-redux";
import { CommonActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-community/async-storage";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { DrawerActions } from "@react-navigation/native";

import BaseClass from "../../../utils/BaseClass";
import { Spacer } from "../../../components/spacer";
import { COMMON_IMAGES, DRAWER_ICONS } from "../../../utils/ImagePaths";
import { styles } from "./styles";
import STRINGS from "../../../utils/Strings";
import COLORS from "../../../themes/Colors";
import { SafeAreaViewContainer } from "../../../utils/BaseStyles";
import { LogoutApi } from "../../../redux/actions/LogoutAction";
import { ConnectycubeAuthServices } from "../../../utils/services";

class PatientCustomDrawerContent extends BaseClass {
  constructor(props) {
    super(props);
    this.state = {
      isLogOut: false,
      loginData: {},
      name: "",
      token: "",
      subscriptionData: [],
      userPicture: "",
    };
  }

  componentDidMount() {
    this.updateUserData();
    this.getConnectyCubeData(false);
  }

  getConnectyCubeData = (isUnsubscribe) => {
    AsyncStorage.getItem("subscriptionData").then((result) => {
      let userData = JSON.parse(result);
      if (userData !== undefined && userData !== null) {
        if (isUnsubscribe) {
          ConnectycubeAuthServices.logout(userData, Platform.OS);
          AsyncStorage.removeItem("subscriptionData");
        } else {
          this.setState({
            subscriptionData: userData,
          });
        }
      }
    });
  };

  componentDidUpdate(prevProps, prevState, snapShot) {
    const { logoutResponse } = this.props.logoutState;
    const { isLogOut } = this.state;
    const { navigation } = this.props;

    if (logoutResponse !== undefined && isLogOut) {
      this.hideDialog();
      if (logoutResponse.code === 200) {
        if (prevProps.logoutResponse !== logoutResponse) {
          this.setState({
            isLogOut: !isLogOut,
          });
          this.showToastSucess(STRINGS.LOGOUT_SUCCESSFUL);
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: "LoginScreen",
                },
              ],
            })
          );
        }
      } else if (logoutResponse.code === 204) {
        this.setState({
          isLogOut: !isLogOut,
        });
        this.showToastAlert(logoutResponse.message);
        navigation.dispatch(DrawerActions.closeDrawer());
      } else if (logoutResponse.code === 400) {
        this.setState({
          isLogOut: !isLogOut,
        });
        this.showToastAlert(logoutResponse.message);
        navigation.dispatch(DrawerActions.closeDrawer());
      } else if (logoutResponse.code === 401) {
        this.setState({
          isLogOut: !isLogOut,
        });
        this.showToastAlert(logoutResponse.message);
        navigation.dispatch(DrawerActions.closeDrawer());
      } else if (logoutResponse.code === 500) {
        this.setState({
          isLogOut: !isLogOut,
        });
        this.showToastAlert(STRINGS.SERVER_ERROR);
        navigation.dispatch(DrawerActions.closeDrawer());
      } else {
        this.setState({
          isLogOut: !isLogOut,
        });
        this.showToastAlert(STRINGS.UNKNOWN_ERROR);
        navigation.dispatch(DrawerActions.closeDrawer());
      }
    }
    this.updateUserData();
  }

  logoutUser = () => {
    const { isLogOut, token } = this.state;
    Alert.alert(
      STRINGS.APP_NAME,
      STRINGS.LOGOUT_ALERT,
      [
        {
          text: STRINGS.CANCEL,
          style: "cancel",
        },
        {
          text: STRINGS.OK,
          onPress: () => {
            if (this.isConnected()) {
              this.setState({ isLogOut: !isLogOut });
              this.getConnectyCubeData(true);
              this.props.logout({ idToken: token });
              AsyncStorage.removeItem(STRINGS.LOGIN_DATA);
              this.props.navigation.navigate("LoginScreen");
            } else {
              this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  updateUserData = () => {
    const { loginData } = this.state;
    AsyncStorage.getItem(STRINGS.LOGIN_DATA)
      .then((result) => {
        let userData = JSON.parse(result);
        if (loginData !== result) {
          if (userData !== undefined && userData !== null) {
            this.setState({
              loginData: userData,
              name: userData.user_data.name,
              token: userData.token,
              userPicture:
                userData.path ==
                  "https://afyanetwork.com/storage/images/patient" ||
                userData.path ==
                  "https://afyanetwork.com/storage/images/doctor" ||
                userData.path == null
                  ? ""
                  : userData.path,
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .done();
  };

  render() {
    const { name, userPicture } = this.state;
    const { navigate } = this.props.navigation;
    return (
      <SafeAreaViewContainer
        style={{ backgroundColor: COLORS.APP_THEME_COLOR }}
      >
        <DrawerContentScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerStyle}>
            <Image
              style={styles.imageStyle}
              source={
                userPicture === ""
                  ? COMMON_IMAGES.DUMMY_USER_PROFILE_PIC
                  : { uri: userPicture }
              }
            />
            <Spacer row={2.5} />
            <View style={styles.textViewStyle}>
              <Text numberOfLines={1} style={styles.textStyle1}>
                {STRINGS.WELCOME_TEXT}
              </Text>
              <TouchableOpacity>
                <Text style={styles.textStyle2}>{name}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Spacer space={6} />
          <DrawerItem
            labelStyle={styles.labelTextStyle}
            label={STRINGS.HOME}
            icon={() => <Image source={DRAWER_ICONS.DRAWER_HOME_ICON} />}
            onPress={() => navigate("PatientHomeScreen")}
          />
          <Spacer space={1.2} />
          <DrawerItem
            labelStyle={styles.labelTextStyle}
            label={STRINGS.MY_ACCOUNT_TEXT}
            icon={() => <Image source={DRAWER_ICONS.MY_ACCOUNT_ICON} />}
            onPress={() => navigate("MyAccountPatient")}
          />
          <Spacer space={1.2} />
          <DrawerItem
            labelStyle={styles.labelTextStyle}
            label={STRINGS.PATIENTS_TEXT}
            icon={() => <Image source={DRAWER_ICONS.PATIENT_ICON} />}
            onPress={() => navigate("PatientsListing")}
          />
          <Spacer space={1.2} />
          <DrawerItem
            labelStyle={styles.labelTextStyle}
            label={STRINGS.GENERAL_DOCTORS_TEXT}
            icon={() => <Image source={DRAWER_ICONS.GENERAL_DOCTOR_ICON} />}
            onPress={() => navigate("GeneralDoctors")}
          />
          <Spacer space={1.2} />
          <DrawerItem
            labelStyle={styles.labelTextStyle}
            label={STRINGS.SPECIALIZED_DOCTORS_TEXT}
            icon={() => <Image source={DRAWER_ICONS.SPECIALIZED_DOCTOR_ICON} />}
            onPress={() => navigate("SpecializedDoctors")}
          />
          <Spacer space={1.2} />
          <DrawerItem
            labelStyle={styles.labelTextStyle}
            label={STRINGS.LAB_TESTS_TEXT}
            icon={() => <Image source={DRAWER_ICONS.LAB_TEST_ICON} />}
            onPress={() => navigate("Labs")}
          />
          <Spacer space={1.2} />
          <DrawerItem
            labelStyle={styles.labelTextStyle}
            label={STRINGS.PHARMACY_TEXT}
            icon={() => <Image source={DRAWER_ICONS.PHARMACY_ICON} />}
            onPress={() => navigate("Pharmacy")}
          />
          <Spacer space={1.2} />
          <DrawerItem
            labelStyle={styles.labelTextStyle}
            label={STRINGS.HISTORY_TEXT}
            icon={() => <Image source={DRAWER_ICONS.HISTORY_ICON} />}
            onPress={() => navigate("PatientConsultationsHistory")}
          />
          <Spacer space={1.2} />
          <DrawerItem
            labelStyle={styles.labelTextStyle}
            label={STRINGS.CONTACT_US_TEXT}
            icon={() => <Image source={DRAWER_ICONS.CONTACT_US_ICON} />}
            onPress={() => navigate("ContactUs")}
          />
          <Spacer space={1.2} />
          <DrawerItem
            labelStyle={styles.labelTextStyle}
            label={STRINGS.NOTIFICATIONS_TEXT}
            icon={() => <Image source={DRAWER_ICONS.NOTIFICATION_ICON} />}
            onPress={() => navigate("Notification")}
          />
          <Spacer space={1.2} />
          <DrawerItem
            labelStyle={styles.labelTextStyle}
            label={STRINGS.SETTINGS_TEXT}
            icon={() => <Image source={DRAWER_ICONS.SETTINGS_ICON} />}
            // onPress={() => alert("coming soon!")}
            onPress={() => navigate("Settings")}
          />
          <Spacer space={1.2} />
          <DrawerItem
            labelStyle={styles.labelTextStyle}
            label={STRINGS.LOGOUT_TEXT}
            icon={() => <Image source={DRAWER_ICONS.LOGOUT_ICON} />}
            onPress={() => this.logoutUser()}
          />
          <Spacer space={6} />
        </DrawerContentScrollView>
      </SafeAreaViewContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  logoutState: state.LogoutReducer,
});

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (payload) => dispatch(LogoutApi(payload)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PatientCustomDrawerContent);
