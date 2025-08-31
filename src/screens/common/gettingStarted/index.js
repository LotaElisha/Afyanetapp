import React from "react";
import { Image, View, Text, ActivityIndicator } from "react-native";
import Swiper from "react-native-swiper";
import AntDesign from "react-native-vector-icons/AntDesign";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

import BaseClass from "../../../utils/BaseClass";
import {
  MainContainer,
  SafeAreaViewContainer,
} from "../../../utils/BaseStyles";
import {
  ActiveDotView,
  ChooseTypeDescriptionText,
  ChooseUserTypeText,
  GetStartedButtonView,
  GetStartedText,
  InActiveDotView,
  SlideContainer,
} from "./styles";
import { Spacer } from "../../../components/spacer";
import STRINGS from "../../../utils/Strings";
import COLORS from "../../../themes/Colors";
import { GETTING_STARTED_IMAGES } from "../../../utils/ImagePaths";
import AsyncStorage from "@react-native-community/async-storage";
import { CommonActions } from "@react-navigation/native";
import messaging from "@react-native-firebase/messaging";
import * as RootNavigation from "../../../utils/rootNavigation";
import ConnectyCube from "react-native-connectycube";
import { ConnectycubeAuthServices } from "../../../utils/services";

export default class GettingStarted extends BaseClass {
  componentDidMount() {
    //kill state
    messaging()
      .getInitialNotification()
      .then(async (notification) => {
        //notification
        if (notification) {
          ConnectycubeAuthServices.init();
          ConnectyCube.chat.disconnect();
          await AsyncStorage.getItem(STRINGS.LOGIN_DATA).then((result) => {
            let userData = JSON.parse(result);
            if (userData && userData.connectycube_token && userData.connect_cube_details) {
              const token = userData.connectycube_token;
              const userId = userData.connect_cube_details.connect_cube_id;
              const _onSuccessLogin = (success) => {
                console.warn("called method1", success)
                this.notificationNavigator(userData, notification)
              };
              const _onErrorLogin = (error) => {
                console.warn("called method2", error)
                this.notificationNavigator(userData, notification)
              };
              ConnectycubeAuthServices.loginWithToken(token, userId)
                .then(_onSuccessLogin)
                .catch(_onErrorLogin);
            }
          });
        }
      });
  }

  notificationNavigator = (userData, notification) => {
    console.warn("called method", notification)
    if (userData.user_data.user_type.toLowerCase() === "patient" || userData.user_data.user_type.toLowerCase() === "caretaker") {
      if (notification.data.body == "video calling") {
        const { data } = notification;
        RootNavigation.reset([
          { name: 'PatientDrawer' },
          {
            name: 'VideoScreen',
            params: {
              userName: data.name,
              opponentsIds: [data.connect_cube_id],
              sender_id: userData.user_data.id,
              receiver_id: data.sender_id,
            },
          },
        ])
      } else if (notification.data.title.startsWith("New Message From") || notification.data.title.startsWith("Multimedia Message From")) {
        console.warn("gdgdgdgd", notification)
        RootNavigation.reset([
          { name: 'PatientDrawer' },
          {
            name: 'ConsultationChatScreen',
            params: {
              data: JSON.parse(notification.data.user_data),
              opponentId: notification.data.sender_id,
              userId: userData.user_data.id,
              token: userData.token,
            },
          },
        ])
      } else {
        RootNavigation.navigate("PatientDrawer")
      }
    } else {
      if (notification.data.body == "video calling") {
        const { data } = notification;
        RootNavigation.reset([
          { name: 'DoctorDrawer' },
          {
            name: 'VideoScreen',
            params: {
              userName: data.name,
              opponentsIds: [data.connect_cube_id],
              sender_id: userData.user_data.id,
              receiver_id: data.sender_id,
            },
          },
        ])
      } else if (notification.data.title.startsWith("New Message From") || notification.data.title.startsWith("Multimedia Message From")) {
        let x = JSON.parse(notification.data.user_data)
        RootNavigation.reset([
          { name: 'DoctorDrawer' },
          {
            name: 'ConsultationChatScreen',
            params: {
              data: x,
              opponentId: notification.data.sender_id,
              userId: userData.user_data.id,
              patientId: x.patient_id,
              token: userData.token,
            },
          },
        ])
      } else {
        RootNavigation.navigate("DoctorDrawer")
      }
    }
  }



  onGettingStartedPress = () => {
    const { navigation } = this.props;
    const { navigate } = navigation;
    AsyncStorage.getItem(STRINGS.LOGIN_DATA)
      .then((result) => {
        let userData = JSON.parse(result);
        if (userData !== undefined && userData !== null) {
          if (
            userData.additional_details === undefined ||
            userData.additional_details === null
          ) {
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
          else {
            if (
              userData.user_data.user_type.toLowerCase() === "patient" ||
              userData.user_data.user_type.toLowerCase() === "caretaker"
            ) {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    {
                      name: "PatientDrawer",
                    },
                  ],
                })
              );
            } else {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    {
                      name: "DoctorDrawer",
                    },
                  ],
                })
              );
            }
          }
        } else {
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
      })
      .catch((error) => { })
      .done();
  };

  _renderSwiperScreen = (image, title, description) => {
    return (
      <SlideContainer>
        <Image
          source={image}
          style={{ width: wp("100%"), height: wp("80%") }}
        />
        <Spacer space={5} />
        <ChooseUserTypeText>{title}</ChooseUserTypeText>
        <Spacer space={3} />
        <ChooseTypeDescriptionText>{description}</ChooseTypeDescriptionText>
      </SlideContainer>
    );
  };

  _renderSwiperContainer = () => {
    return (
      <Swiper
        loop={false}
        showsButtons={false}
        dot={<InActiveDotView />}
        activeDot={<ActiveDotView />}
      >
        {this._renderSwiperScreen(
          GETTING_STARTED_IMAGES.CHOOSE_MEDICINE_IMAGE,
          STRINGS.CHOOSE_MEDICINE_TEXT,
          "AfyaNet let’s you visit your health providers, therapists and care takers from a tap of your phone. You get to skip the waiting line and get well soon."
        )}
        {this._renderSwiperScreen(
          GETTING_STARTED_IMAGES.CHOOSE_HOSPITAL_IMAGE,
          STRINGS.CHOOSE_DOCTOR_TEXT,
          "You will get connected to our vast directory of doctors and healthcare providers within seconds."
        )}
      </Swiper>
    );
  };

  render() {
    return (
      <SafeAreaViewContainer>
        <MainContainer>
          {this._renderSwiperContainer()}

          <GetStartedButtonView
            onPress={() => {
              this.onGettingStartedPress();
            }}
          >
            <GetStartedText>{STRINGS.GETTING_STARTED}</GetStartedText>
            <Spacer row={2} />
            <AntDesign
              name={"arrowright"}
              color={COLORS.WHITE_COLOR}
              size={30}
            />
          </GetStartedButtonView>
        </MainContainer>
      </SafeAreaViewContainer>
    );
  }
}
