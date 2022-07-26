import React from 'react'
import {AccessToken, GraphRequest, GraphRequestManager, LoginManager} from 'react-native-fbsdk'
import {TouchableOpacity,Image} from "react-native";
import {AUTH_IMAGES} from "../../../utils/ImagePaths";

class FacebookService {
    constructor() {
        this.accessToken = undefined;
    }

    facebookLoginButton(callback) {
        return (
            <TouchableOpacity onPress={() => {
                try {
                    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
                        function (result) {
                            if (result.isCancelled) {
                                console.log('LoginReducer cancelled');
                            } else {
                                console.log(
                                    'LoginReducer success with permissions: ' +
                                    result.grantedPermissions.toString(),
                                );
                                return AccessToken.getCurrentAccessToken().then(
                                    (data) => {
                                        const responseInfoCallback = async (error, result) => {
                                            if (error) {
                                            } else {
                                                // create a new firebase credential with the token
                                                // login with credential
                                                callback(result)
                                            }
                                        };
                                        const infoRequest = new GraphRequest(
                                            '/me',
                                            {
                                                accessToken: data.accessToken,
                                                parameters: {
                                                    fields: {
                                                        string: 'email,name,first_name,middle_name,last_name,picture.type(large)',
                                                    },
                                                },
                                            },
                                            responseInfoCallback,
                                        );
                                        // Start the graph request.
                                        new GraphRequestManager().addRequest(infoRequest).start();
                                    });
                            }
                        },
                        function (error) {
                            console.log('LoginReducer fail with error: ' + error);
                        });
                } catch (e) {
                }

            }}>
                <Image source={AUTH_IMAGES.FACEBOOK_ICON}/>
            </TouchableOpacity>

        )
    }
}

export const facebookService = new FacebookService();
