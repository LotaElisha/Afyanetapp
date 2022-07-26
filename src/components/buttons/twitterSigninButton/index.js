import React from "react"
import {
    NativeModules,
    TouchableOpacity,
    Platform, Image
} from "react-native"
import {AUTH_IMAGES} from "../../../utils/ImagePaths";


const {RNTwitterSignIn} = NativeModules;

const Constants = {
    TWITTER_CONSUMER_KEY: "VBNLRcvpi4O1LXZLEWAlTCxH3",
    TWITTER_CONSUMER_SECRET: "cLb8mB7i0Mm5kUFJO7MbRjdJdZHpBdbuAEYdjsg3UM7kd5UbCH"
};

class TwitterService {

    twitterLoginButton(callback) {
        return (
            <TouchableOpacity onPress={() => {
                RNTwitterSignIn.init(Constants.TWITTER_CONSUMER_KEY, Constants.TWITTER_CONSUMER_SECRET);
                RNTwitterSignIn.logIn()
                    .then(loginData => {
                        const {authToken, authTokenSecret} = loginData;
                        if (authToken && authTokenSecret) {
                            let profile = loginData;
                            profile.avatar = Platform.OS=== 'ios'? `https://twitter.com/${loginData.userName}/profile_image?size=original`: profile.avatar;
                            callback(profile)
                        }
                    })
                    .catch(error => {
                        }
                    )
            }}>
                <Image source={AUTH_IMAGES.TWITTER_ICON}/>
            </TouchableOpacity>
        )
    }
}

export const twitterService = new TwitterService();
