import React, { Component } from 'react'
import BaseClass from "../../../../utils/BaseClass";
import { WebView } from 'react-native-webview';
import AsyncStorage from "@react-native-community/async-storage";
import STRINGS from "../../../../utils/Strings";
import { CommonActions } from '@react-navigation/native';
import { MainContainer, SafeAreaViewContainer, ScrollContainer, ShadowViewContainer } from "../../../../utils/BaseStyles";

import { View, Image, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import COLORS from "../../../../themes/Colors";
import OrientationLoadingOverlay from "../../../../utils/CustomLoader";
import { Header } from 'react-native-elements'
import {
    DRAWER_ICONS,
} from "../../../../utils/ImagePaths";
import { FONT } from "../../../../themes/FontSizes";
import { FONT_FAMILY } from "../../../../themes/FontFamilies";
import AntDesign from "react-native-vector-icons/AntDesign";
import { PaymentOrderStatusApi } from '../../../../redux/actions/PaymentAction'


export default class PaymentOnWeb extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            url: '',
            screenType: '',
            orderId: "",
            isLoading: false
        }
    }
    componentDidMount = () => {
        const { navigate } = this.props.navigation;
        const { route } = this.props;
        const { url, fromScreen } = route.params;
        this.setState({
            url: url,
            screenType: fromScreen
        })
    }
    _renderCustomLoader = () => {
        const { isLoading } = this.state;
        return (
            <OrientationLoadingOverlay visible={isLoading} message="Loading.." />
        )
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
                    <AntDesign
                        name={"arrowleft"}
                        color={COLORS.LIGHT_BLACK_COLOR}
                        size={30}
                        onPress={() => navigation.pop()}
                    />
                }
                centerComponent={{
                    text: "Payment",
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
                    height: 60,
                }}
            />
        );
    };
    render() {
        const { url } = this.state;
        return (
            <SafeAreaViewContainer>
                <KeyboardAvoidingView
                    style={{ flex: 1, backgroundColor: COLORS.APP_THEME_COLOR }}
                    behavior={(Platform.OS === 'ios') ? 'padding' : null}>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            Keyboard.dismiss()
                        }}>
                        <MainContainer >
                            {this._renderHeader()}
                            <WebView
                                // style={{
                                //     height: hp(100),
                                //     width: wp(100),
                                //     flex: 1
                                // }}
                                panGestureEnabled={false}
                                style={{
                                    height: 300,//Dimensions.get('window').height - 170,
                                    width: Dimensions.get('window').width,
                                    flex: 1
                                }}
                                automaticallyAdjustContentInsets={false}
                                ref={(ref) => (this.webview = ref)}
                                javaScriptEnabled={true}
                                domStorageEnabled={true}
                                startInLoadingState={true}
                                scalesPageToFit={true}
                                containerStyle={{ justifyContent: 'center' }}
                                source={{ uri: url }}
                                onNavigationStateChange={this.handleWebViewNavigationStateChange}
                            />
                            {this._renderCustomLoader()}
                        </MainContainer>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </SafeAreaViewContainer>

        )
    }

    handleWebViewNavigationStateChange = (newNavState) => {
        const { navigate } = this.props.navigation;
        const { url } = newNavState;
        const { screenType, orderId } = this.state
        console.log('callback payment', newNavState);
        if (!url) return;

        if (url.includes('show-payment-detail')) {
            this.webview.stopLoading();
            //call order status API here
            var order_id = url.split('/')[4];

            if (this.isConnected()) {
                if (orderId !== order_id) {
                    this.setState({
                        orderId: order_id
                    })
                    this.showDialog();
                    PaymentOrderStatusApi({
                        "order_id": order_id,
                    }, response => this.handleOrderResponse(response, screenType));
                }

            } else {
                this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
            }
        }

        // one way to handle a successful form submit is via query strings
        if (url.includes('message=success')) {
            this.webview.stopLoading();
            // maybe close this view?
        }

        // one way to handle errors is via query string
        if (url.includes('?errors=true')) {
            this.webview.stopLoading();
        }

    };

    handleOrderResponse = (response, type) => {
        debugger
        const { navigation } = this.props
        const { navigate } = navigation;
        const { params } = this.props.route;
        this.hideDialog()
        if (response !== undefined && response !== null) {
            if (response.result == "SUCCESS") {
                console.warn('payment response', response)
                console.warn('data', response.data[0])
                // for payment status pending
                if (response.data[0].payment_status == "PENDING") {
                    this.showToastAlert('Payment is pending.');
                    navigation.pop(1)                   
                }
                // for payment status completed
                else if (response.data[0].payment_status == "COMPLETED") {
                    if (type.toLowerCase() === "login" || type.toLowerCase() === "doctor login")
                        AsyncStorage.setItem(STRINGS.LOGIN_DATA, JSON.stringify(params.userData));

                    if (type.toLowerCase() === "pharmacy") {
                        // navigate('Pharmacy')
                        navigation.pop(2)
                    }
                    else if (type.toLowerCase() === "labs") {
                        // navigate('Labs')
                        navigation.pop(2)
                    }
                    else if (type.toLowerCase() === "login" || type.toLowerCase() === "consultation") {
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [
                                    {
                                        name: 'PatientDrawer'
                                    },
                                ],
                            })
                        )
                    }
                    else if (type.toLowerCase() === "doctor login") {
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [
                                    {
                                        name: 'DoctorDrawer'
                                    },
                                ],
                            })
                        )
                    }
                }
                // for payment status others
                else {
                    this.showToastAlert(response.data[0].payment_status);
                    navigation.pop(2)
                }
            }
            else {
                this.hideDialog()
                this.showToastAlert(STRINGS.UNKNOWN_ERROR);
            }
        } else {
            this.hideDialog()
            this.showToastAlert(STRINGS.UNKNOWN_ERROR);
        }
    }
}