import React, { Component } from 'react'
import BaseClass from "../../../utils/BaseClass";
import { WebView } from 'react-native-webview';
import AsyncStorage from "@react-native-async-storage/async-storage";
import STRINGS from "../../../utils/Strings";
import { CommonActions } from '@react-navigation/native';
import { MainContainer, SafeAreaViewContainer, ScrollContainer, ShadowViewContainer } from "../../../utils/BaseStyles";

import { View, Image, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import COLORS from "../../../themes/Colors";
import OrientationLoadingOverlay from "../../../utils/CustomLoader";
import { Header } from 'react-native-elements'
import { FONT } from "../../../themes/FontSizes";
import { FONT_FAMILY } from "../../../themes/FontFamilies";
import AntDesign from "react-native-vector-icons/AntDesign";


export default class TermsAndConditions extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            url: '',
            isLoading: false
        }
    }
    componentDidMount = () => {
        const { navigate } = this.props.navigation;
        const { route } = this.props;
        const { url } = route.params;
        this.setState({
            url: url
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
                    text: "Terms and Conditions",
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
                            {/* <ScrollContainer
                                keyboardShouldPersistTaps={'handled'}
                                showsVerticalScrollIndicator={false}
                                scrollEnabled={false}
                            > */}
                                <WebView
                                    style={{
                                        height: hp(100),
                                        width: wp(100),
                                        flex:1
                                    }}
                                    ref={(ref) => (this.webview = ref)}
                                    javaScriptEnabled={true}
                                    domStorageEnabled={true}
                                    startInLoadingState={true}
                                    scalesPageToFit={true}
                                    containerStyle={{ justifyContent: 'center' }}
                                    source={{ uri: url }}
                                    onNavigationStateChange={this.handleWebViewNavigationStateChange}

                                />
                            {/* </ScrollContainer> */}
                        </MainContainer>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </SafeAreaViewContainer>

        )
    }

    handleWebViewNavigationStateChange = (newNavState) => {
        const { navigate } = this.props.navigation;
        const { url } = newNavState;
        console.log('callback', newNavState);
        if (!url) return;

        if (url.includes('show-payment-detail')) {
            this.webview.stopLoading();

        }

        // one way to handle a successful form submit is via query strings
        if (url.includes('?message=success')) {
            this.webview.stopLoading();
            // maybe close this view?
        }

        // one way to handle errors is via query string
        if (url.includes('?errors=true')) {
            this.webview.stopLoading();
        }

    };




}