import React from 'react';
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import BaseClass from "../../../utils/BaseClass";
import { View, ImageBackground, Text, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { FlutterwaveInit } from 'flutterwave-react-native';
import styles from './styles'
import { MainContainer, SafeAreaViewContainer, ScrollContainer, ShadowViewContainer } from "../../../utils/BaseStyles";
import COLORS from "../../../themes/Colors";
import { PayWithFlutterwaveV2 } from 'flutterwave-react-native';
export default class PaymentScreen extends BaseClass {

    constructor() {
        super();
        this.state = {
            pigeons: [],
        };
    }

    handleOnRedirect = (res) => {

        console.log('res is', res)
    }


    render() {
        return (
            <SafeAreaViewContainer>
                <KeyboardAvoidingView
                    style={{ flex: 1, backgroundColor: COLORS.APP_THEME_COLOR }}
                    behavior={(Platform.OS === 'ios') ? 'padding' : null}>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            Keyboard.dismiss()
                        }}>
                        <ScrollContainer keyboardShouldPersistTaps={'handled'} showsVerticalScrollIndicator={false}>
                            <MainContainer>
                                <View
                                    style={{
                                        height: 500,
                                        width: 500,
                                        justifyContent: 'center',
                                        alignSelf: 'center',
                                    }}>
                                    <PayWithFlutterwaveV2
                                        onRedirect={(res) => this.handleOnRedirect(res)}

                                        options={{
                                            payment_options: "card",
                                            txref: "rave-123222456732",
                                            PBFPubKey: 'FLWPUBK_TEST-56ecf0f10c5a75e96a137ac2f5379e1b-X',
                                            customer_email: 'sandeep@gmail.com',
                                            amount: 200,
                                            customer_phone: '9780349145',
                                            currency: 'NGN',
                                        }}
                                    />
                                    </View>
                            </MainContainer>
                        </ScrollContainer>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </SafeAreaViewContainer >
        )
    }
}

