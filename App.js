import React, { Component } from 'react';
import ScreenNavigator from "./src/router/AppNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NetworkProvider } from "./src/utils/NetworkProvider";
import { Provider } from "react-redux";
import Store from "./src/redux/store";
import { StatusBar, Platform, PermissionsAndroid, DeviceEventEmitter } from "react-native";
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import { ConnectycubeAuthServices } from "./src/utils/services";
import AsyncStorage from '@react-native-community/async-storage';
import ConnectyCube from "react-native-connectycube";
import * as RootNavigation from "./src/utils/rootNavigation"
import { navigationRef } from "./src/utils/rootNavigation";
import { DEVICE_TYPE } from "./src/redux/constants"
import { GetFcmToken } from './src/redux/actions/DeviceConvertAction'
import STRINGS from './src/utils/Strings'
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import messaging from '@react-native-firebase/messaging';


// import invokeApp from 'react-native-invoke-app';

export const notificationActionHandler = async (data) => {

}


export default class App extends Component {

    constructor(props) {
        super(props);
        this.pushConfig()
        ConnectycubeAuthServices.init();
        PushNotification.createChannel(
            {
                channelId: "default-channel-id", // (required)
                channelName: `Default channel`, // (required)
                channelDescription: "A default channel", // (optional) default: undefined.
                soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
                importance: 4, // (optional) default: 4. Int value of the Android notification importance
                vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
            },
            (created) => console.warn(`createChannel 'default-channel-id' returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );
    }


    getToken = async () => {
        let fcmToken = await messaging().getToken();
        AsyncStorage.setItem("deviceToken", fcmToken)
        console.warn('fcm==========>', fcmToken);
    }

    requestPermissionsForIos = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            this.getToken();
        } else {

        }
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

    handleLocalNotificationClick = (userData, notification) => {
        if (notification.userInteraction && notification.foreground === true) {

        }
    }

    async componentDidMount() {
        // this.pushConfig()
        PushNotification.removeAllDeliveredNotifications();
        this.requestPermissionsForIos();
        messaging().onNotificationOpenedApp(async notification => {
            if (notification) {
                ConnectycubeAuthServices.init();
                ConnectyCube.chat.disconnect();
                await AsyncStorage.getItem(STRINGS.LOGIN_DATA).then((result) => {
                    let userData = JSON.parse(result);
                    if (userData !== undefined && userData !== null) {
                        let user = {
                            id: userData.connect_cube_details.connect_cube_id,
                            email: userData.user_data.email,
                            password: "Mind@123",
                        };
                        const _onSuccessLogin = (success) => {
                            console.warn("called method1", success)
                            this.notificationNavigator(userData, notification)
                        };
                        const _onErrorLogin = (error) => {
                            console.warn("called method2", error)
                            this.notificationNavigator(userData, notification)
                        };
                        ConnectycubeAuthServices.login(user, "")
                            .then(_onSuccessLogin)
                            .catch(_onErrorLogin);
                    }
                });
            }
        })

        messaging().onMessage(async remoteMessage => {
            console.warn("notification message received", remoteMessage)
            const { title, body } = remoteMessage.notification
            PushNotification.localNotification({
                /* Android Only Properties */
                channelId: "default-channel-id", // (required) channelId, if the channel doesn't exist, it will be created with options passed above (importance, vibration, sound). Once the channel is created, the channel will not be update. Make sure your channelId is different if you change these options. If you have created a custom channel, it will apply options of the channel.
                ticker: "My Notification Ticker", // (optional)           
                vibrate: true, // (optional) default: true             
                data: remoteMessage.data,
                ongoing: false, // (optional) set whether this is an "ongoing" notification
                priority: "max", // (optional) set notification priority, default: high
                visibility: "public", // (optional) set notification visibility, default: private
                ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
                onlyAlertOnce: true, // (optional) alert will open only once with sound and notify, default: false
                when: null, // (optionnal) Add a timestamp pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
                usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
                invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
                title: title, // (optional)
                message: body, // (required)
                playSound: true, // (optional) default: true
                soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
            });
        })
    }

    pushConfig = () => {
        PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister: function (token) {

            },
            // (required) Called when a remote is received or opened, or local notification is opened
            onNotification: async notification => {
                if (notification.foreground) {
                    if (notification.message === "video calling" || notification.data['gcm.notification.text'] == "video calling") {
                        //PushNotification.removeAllDeliveredNotifications();
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
                                    const { data } = notification;
                                    RootNavigation.navigate('VideoScreen',
                                        {
                                            userName: data.name,
                                            opponentsIds: [data.connect_cube_id],
                                            sender_id: userData.user_data.id,
                                            receiver_id: data.sender_id
                                        })
                                };
                                const _onErrorLogin = (error) => {
                                    const { data } = notification;
                                    RootNavigation.navigate('VideoScreen',
                                        {
                                            userName: data.name,
                                            opponentsIds: [data.connect_cube_id],
                                            sender_id: userData.user_data.id,
                                            receiver_id: data.sender_id
                                        })
                                }

                                ConnectycubeAuthServices.login(user, "")
                                    .then(_onSuccessLogin)
                                    .catch(_onErrorLogin)
                            }
                        })
                    } else if (notification.userInteraction) {

                        await AsyncStorage.getItem(STRINGS.LOGIN_DATA).then((result) => {
                            let userData = JSON.parse(result);
                            if (notification.data.title.startsWith("New Message From") || (notification.data['gcm.notification.text'] !== undefined && notification.data['gcm.notification.text'].startsWith("New Message From"))) {
                                let x = JSON.parse(notification.data.user_data)
                                RootNavigation.navigate("ConsultationChatScreen", {
                                    data: x,
                                    opponentId: notification.data.sender_id,
                                    userId: userData.user_data.id,
                                    patientId: x.patient_id,
                                    token: userData.token,
                                })
                            } else {
                                if (userData.user_data.user_type.toLowerCase() === "patient" || userData.user_data.user_type.toLowerCase() === "caretaker") {
                                    RootNavigation.navigate("PatientDrawer")
                                } else {
                                    RootNavigation.navigate("DoctorDrawer")
                                }
                            }
                        })
                    }
                }


                notification.finish(PushNotificationIOS.FetchResult.NoData);
            },

            // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
            onAction: function (notification) {
                console.warn('onAction', notification)
            },

            // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
            onRegistrationError: function (err) {
                console.warn('error in token', err)
            },

            // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
            senderID: "450742348040",


            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },

            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,

            /**
             * (optional) default: true
             * - Specified if permissions (ios) and token (android and ios) will requested or not,
             * - if not, you must call PushNotificationsHandler.requestPermissions() later
             * - if you are not using remote notification or do not have Firebase installed, use this:
             *     requestPermissions: Platform.OS === 'ios'
             */
            requestPermissions: true,
            // 'content-available': 1
        });
    };


    render() {
        return (
            <SafeAreaProvider>
                <Provider store={Store}>
                    <NetworkProvider>
                        <StatusBar barStyle="dark-content" hidden={false} translucent={true} />
                        <NavigationContainer ref={navigationRef}>
                            <ScreenNavigator />
                        </NavigationContainer>
                    </NetworkProvider>
                </Provider>
            </SafeAreaProvider>
        );
    }
}
