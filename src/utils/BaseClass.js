/*
 * ---------------------------------------------------------------------------------------
 * ---------------------------------------------------------------------------------------
 *  IMPORTS
 * ---------------------------------------------------------------------------------------
 * ---------------------------------------------------------------------------------------
 */

// ----------------------------------------
// PACKAGE IMPORTS
// ----------------------------------------
import React, {Component} from 'react';
import {Platform, Linking} from 'react-native';
import Snackbar from 'react-native-snackbar';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';

// ----------------------------------------
// LOCAL & CONFIG IMPORTS
// ----------------------------------------
import COLORS from '../themes/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import STRINGS from './Strings';

// variables.....
let autoRefreshToken;

/*
 * ---------------------------------------------------------------------------------------
 * ---------------------------------------------------------------------------------------
 *  MAIN CLASS
 * ---------------------------------------------------------------------------------------
 * ---------------------------------------------------------------------------------------
 */
export default class BaseClass extends Component {
    // ----------------------------------------
    // ----------------------------------------
    // CONSTRUCTOR AND LIFE CYCLES
    // ----------------------------------------
    constructor(props) {
        super(props);
        this.token = '';
        this.isInternetConnected = true;

    }


    // ----------------------------------------

    isConnected = () => {
        NetInfo.addEventListener(state => {
            this.isInternetConnected = state.isConnected;
        });

        NetInfo.fetch().then(state => {
            this.isInternetConnected = state.isConnected;
        });

        return this.isInternetConnected;
    };


    // ----------------------------------------
    // ----------------------------------------
    // TOAST METHODS
    // ----------------------------------------
    // ----------------------------------------

    // -------------------Simple Toast---------------------
    showToast(title) {
        if (Platform.OS === 'ios') {
            Snackbar.show({
                text: title,
                textColor: COLORS.WHITE_COLOR,
                backgroundColor: COLORS.GREY_COLOR,
                duration: Snackbar.LENGTH_LONG,
                action: {
                    color: COLORS.WHITE_COLOR,
                    onPress: () => { /* Do something. */
                    },
                },
            });
        } else {
            Toast.show(title, 3000);
        }
    }

    // -------------------Toast For Success---------------------

    showToastSucess = (title) => {
        if (Platform.OS === 'ios') {
            Snackbar.show({
                text: title,
                textColor: COLORS.WHITE_COLOR,
                backgroundColor: COLORS.APP_THEME_COLOR,
                duration: Snackbar.LENGTH_LONG,
                action: {
                    // color: COLORS.WHITE_COLOR,
                    onPress: () => { /* Do something. */
                    },
                },
            });
        } else {
            Toast.show(title, 4000);
        }
    };

    // ------------------Toast For Error----------------------

    showToastAlert = (title) => {
        if (Platform.OS === 'ios') {
            Snackbar.show({
                text: title,
                textColor: COLORS.WHITE_COLOR,
                backgroundColor: COLORS.FAILURE_TOAST_COLOR,
                duration: Snackbar.LENGTH_LONG,
                action: {
                    // color: COLORS.FAILURE_TOAST_COLOR,
                    onPress: () => { /* Do something. */
                    },
                },
            });
        } else {
            Toast.show(title, 3000);
        }
    };

    // ----------------------------------------
    /**
     * start screen loader.....
     */
    showDialog() {
        this.setState({isLoading: true});
    }

    // ----------------------------------------
    /**
     * stop screen loader.....
     */
    hideDialog() {
        this.setState({isLoading: false});
    }


    // ----------------------------------------
    /**
     * make link to device phone.....
     * @param phone
     */
    goToDialNumber(phone) {
        let phoneNumber = phone;
        if (Platform.OS !== 'android') {
            phoneNumber = `telprompt:${phone}`;
        } else {
            phoneNumber = `tel:${phone}`;
        }
        return Linking.openURL(phoneNumber);
    }


    // ----------------------------------------
    /**
     * auto refreshing token () start & cancel......
     * @param value
     */
    // autoRefreshToken(value) {
    //     if (value === 'start') {
    //         autoRefreshToken = setInterval(() => {
    //             this.requestTokenRefresh();
    //         }, 3000000); // 50 mins
    //     } else {
    //         clearInterval(autoRefreshToken);
    //     }
    // }


    /**
     * token () start & cancel......
     */
    deviceToken() {
        return Math.floor(100000 + Math.random() * 900000);
    }

    imageTimestamp() {
        return Math.floor(100000 + Math.random() * 900000);
    }


}
