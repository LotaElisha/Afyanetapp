import {GoogleSignin, statusCodes} from "@react-native-google-signin/google-signin";
import {TouchableOpacity, Image} from "react-native";
import React from "react";
import {AUTH_IMAGES} from "../../../utils/ImagePaths";

class GoogleService {
    googleLogin(callBack) {
        return (
            <TouchableOpacity onPress={async () => {
                try {
                    await GoogleSignin.hasPlayServices();
                    const userInfo = await GoogleSignin.signIn();
                    callBack(userInfo);
                } catch (error) {
                    callBack(error);
                    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                        // user cancelled the login flow
                    } else if (error.code === statusCodes.IN_PROGRESS) {
                        // operation (f.e. sign in) is in progress already
                    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                        // play services not available or outdated
                    } else {
                        // some other error happened
                    }
                }
            }}>
                <Image source={AUTH_IMAGES.GOOGLE_ICON}/>
            </TouchableOpacity>
        )

    };
}

export const googleService = new GoogleService();
