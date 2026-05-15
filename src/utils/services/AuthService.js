import ConnectyCube from 'react-native-connectycube';
import {credentials} from "../config";
import {Platform} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class AuthService {

    init = () => {
        ConnectyCube.init(...credentials);
        ConnectyCube.createSession()
            .then((session) => {
            })
            .catch((error) => {
            });
    };

    createConnectyCubeUser = (profileData) => {
        return new Promise((user, error) => {
            ConnectyCube.users
                .signup(userProfile)
                .then(user)
                .catch(error);
        })
    }

    deleteSubscription = (subscriptions, platform) => {
        let subscriptionIdToDelete;

        const DeviceInfo = require('react-native-device-info').default
        subscriptions.forEach((sbs) => {
            if (sbs.subscription.device.platform.name === platform && sbs.subscription.device.udid === DeviceInfo.getUniqueId()) {
                subscriptionIdToDelete = sbs.subscription.id;
            }
        });

        if (subscriptionIdToDelete) {
            ConnectyCube.pushnotifications.subscriptions.delete(subscriptionIdToDelete);
        }
    };

    subcribeToPushNotification = async (deviceToken) => {
        const DeviceInfo = require('react-native-device-info').default
        const params = {
            notification_channel: Platform.OS === 'ios' ? 'apns' : 'gcm',
            device: {
                platform: Platform.OS,
                udid: DeviceInfo.getUniqueId()
            },
            push_token: {
                environment: 'development',
                client_identification_sequence: deviceToken,
                bundle_identifier: "com.afyanet"
            }
        }
        await ConnectyCube.pushnotifications.subscriptions.create(params).then(result => {
            AsyncStorage.setItem("subscriptionData", JSON.stringify(result))
        }).catch(error => {
        });
    }


    login = (user, deviceToken) => {
        return new Promise((resolve, reject) => {
            ConnectyCube.createSession(user)
                .then(() => {
                        // this.subcribeToPushNotification(deviceToken)
                        ConnectyCube.chat.connect({
                            userId: user.id,
                            password: user.password,
                        })
                            .then(resolve)
                            .catch(reject);
                    }
                )
                .then(resolve)
                .catch(reject);
        });
    };

    signup = user => {
        return new Promise((resolve, reject) => {
            ConnectyCube.users
                .signup(userProfile)
                .then(resolve)
                .catch(reject);
        })
    }

    checkConnection = () => {
      return  ConnectyCube.chat.isConnected()
    }

    logout = (subscriptions, platform) => {

        this.deleteSubscription(subscriptions, platform)
        ConnectyCube.chat.disconnect();
        ConnectyCube.destroySession();
    };

}
