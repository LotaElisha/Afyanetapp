/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App, { notificationActionHandler } from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import { ConnectycubeAuthServices } from './src/utils/services';
import ConnectyCube from 'react-native-connectycube';
import AsyncStorage from '@react-native-async-storage/async-storage';
import STRINGS from './src/utils/Strings'

messaging().setBackgroundMessageHandler(async remoteMessage => {
 // console.warn("yryryryryyryr", remoteMessage)
  ConnectycubeAuthServices.init();
  ConnectyCube.chat.disconnect();
  await AsyncStorage.getItem(STRINGS.LOGIN_DATA).then((result) => {
    let userData = JSON.parse(result);
    if (userData !== undefined && userData !== null) {
      let user = {
        id: userData.connect_cube_details.connect_cube_id,
        email: userData.user_data.email,
        password: "Mind@123",
      }

      const _onSuccessLogin = (success) => {
      };

      const _onErrorLogin = (error) => {

      }

      ConnectycubeAuthServices.login(user, "")
        .then(_onSuccessLogin)
        .catch(_onErrorLogin)
    }
  })

  notificationActionHandler(remoteMessage);
});

// AppRegistry.registerHeadlessTask(
//   'ReactNativeFirebaseMessagingHeadlessTask', () => notificationActionHandler,
// );

AppRegistry.registerComponent(appName, () => App);
