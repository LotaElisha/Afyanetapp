import React from "react";
import {
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,
    Image,
    View,
    Platform,
    TextInput
} from "react-native";
import { Input } from "react-native-elements";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BaseClass from "../../../utils/BaseClass";
import COLORS from "../../../themes/Colors";
import { AUTH_IMAGES } from "../../../utils/ImagePaths";
import { Spacer } from "../../../components/spacer";
import STRINGS from "../../../utils/Strings";
import { FONT_FAMILY } from "../../../themes/FontFamilies";
import { FONT } from "../../../themes/FontSizes";
import { NewPrimaryButton } from "../../../components/buttons/primaryButton";
import {
    AppIconImageComponent,
    CurvedImageBackground,
    FillInfoTextComponent
} from "../auth/authComponents";
import { MainContainer, SafeAreaViewContainer, ScrollContainer, ShadowViewContainer } from "../../../utils/BaseStyles";
import { AbsoluteContainer, CardContainerStyle, CardHeadingStyle, TextInputHeading } from "../auth/authComponents/styles";
import {
    PleaseLoginText, InputContainer
} from "./styles";
import OrientationLoadingOverlay from "../../../utils/CustomLoader";
import AntDesign from "react-native-vector-icons/AntDesign";
import DropDownPicker from 'react-native-dropdown-picker';
import { PaymentApi, GetFeeApi } from '../../../redux/actions/PaymentAction'

export default class Payment extends BaseClass {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            id: "",
            accessToken: '',
            paymentType: '',
            paymentAmount: '',
            isLogin: false,
            url: ''
        };
        this.isVisible = false;
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {


    }

    componentDidMount = () => {
        const { screen_type } = this.props.route.params;
        if (screen_type.toLowerCase() == 'login' || screen_type.toLowerCase() == 'doctor login') {
            if (this.isConnected()) {
                GetFeeApi({
                    "user_type": screen_type.toLowerCase() === 'login' ? 'patient' : 'doctor'
                }, response => this.handleFeeResponse(response));
            } else {
                this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
            }
        }
        else if (screen_type.toLowerCase() == 'consultation') {
            this.setState({
                isLogin: true,
                paymentAmount: this.props.route.params.consultation_fees.toString()
            })
        }
        else if (screen_type.toLowerCase() == 'labs') {
            this.setState({
                isLogin: true,
                paymentAmount: this.props.route.params.consultation_fees.toString()
            })
        }
        else if (screen_type.toLowerCase() == 'pharmacy') {
            this.setState({
                isLogin: true,
                paymentAmount: this.props.route.params.consultation_fees.toString()
            })
        }
        else{
            this.setState({
                isLogin: true
            })
        }
    };
    handleFeeResponse = (response) => {
        this.hideDialog()
        if (response !== undefined && response !== null) {
            if (response.code === 200) {
                // this.hideDialog()
                this.setState({
                    isLogin: true,
                    paymentAmount: response.data
                })
            } else if (response.code === 204) {
                // this.hideDialog()
                this.showToastAlert(response.message);
            } else if (response.code === 400) {
                // this.hideDialog()
                this.showToastAlert(response.message);
            } else if (response.code === 401) {
                // this.hideDialog()
                this.showToastAlert(response.message);
            } else if (response.code === 500) {
                // this.hideDialog()
                this.showToastAlert(STRINGS.SERVER_ERROR);
            } else if (response.code === 502) {
                this.hideDialog()
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

    componentWillUnmount() {
    }

    _renderCardView = () => {
        const { navigation } = this.props;
        const { navigate } = navigation;
        const { paymentType, paymentAmount, isLogin } = this.state;
        const { screen_type } = this.props.route.params;
        let payingFor = ''
        if (screen_type.toLowerCase() == 'login' || screen_type.toLowerCase() == 'doctor login')
            payingFor = 'One time registration fee'
        else if (screen_type.toLowerCase() == 'labs')
            payingFor = 'Laboratory tests charges'
        else if (screen_type.toLowerCase() == 'pharmacy')
            payingFor = 'Medicines charges'
        else
            payingFor = 'Consultation charges'
        return (
            <CardContainerStyle>
                {/* <CardHeadingStyle>{"Payment"}</CardHeadingStyle> */}
                <Spacer space={2} />
                <PleaseLoginText>{'Select an option to make payment'}</PleaseLoginText>
                <Spacer space={2} />
                <View style={{ alignItems: "center" }}>
                    <TextInputHeading >{'Payment Options'}</TextInputHeading>
                    <DropDownPicker
                        items={[
                            { label: 'AirtelMoney', value: 'AIRTELMONEY' },
                            { label: 'TigoPesa', value: 'TIGOPESA' },
                            { label: 'Others', value: 'OTHERS' },
                        ]}
                        defaultValue={paymentType}
                        onOpen={() => this.isVisible = true}
                        onClose={() => this.isVisible = false}
                        controller={instance => this.controller = instance}
                        placeholder="Select"
                        containerStyle={{ width: wp("76%") }}
                        style={{
                            backgroundColor: 'transparent',
                            paddingLeft: 0,
                            paddingRight: wp("1%"),
                            paddingBottom: wp("2.5%"),
                            paddingTop: wp("3.5%"),
                            borderWidth: 0,
                            borderBottomColor: "#DDE7E6",
                            borderBottomWidth: 2
                        }}
                        itemStyle={{
                            justifyContent: 'flex-start',
                        }}
                        labelStyle={{
                            color: COLORS.GREY_COLOR,
                            fontSize: FONT.TextNormal,
                            fontFamily: FONT_FAMILY.MontserratRegular
                        }}
                        dropDownStyle={{ backgroundColor: COLORS.WHITE_COLOR }}
                        onChangeItem={item => {
                            this.isVisible = false;
                            this.setState({
                                paymentType: item.value
                            })
                        }}
                        selectedLabelStyle={{
                            color: COLORS.GREY_COLOR,
                            fontSize: FONT.TextNormal,
                            fontFamily: FONT_FAMILY.MontserratRegular
                        }}
                        activeLabelStyle={{ color: COLORS.APP_THEME_COLOR }}
                        customArrowUp={() => <Image source={AUTH_IMAGES.DROP_DOWN_ICON} resizeMode={'contain'} />}
                        customArrowDown={() => <Image source={AUTH_IMAGES.DROP_DOWN_ICON} resizeMode={'contain'} />}
                    />
                    <Spacer space={4} />
                    <TextInputHeading>{'Payable Amount'}</TextInputHeading>
                    <Spacer space={2} />
                    <InputContainer>
                        <TextInput style={{
                            flex: 1,
                            color: COLORS.GREY_COLOR,
                            fontSize: FONT.TextNormal,
                            fontFamily: FONT_FAMILY.MontserratRegular
                        }}
                            scrollEnabled={false}
                            placeholder='payable amount'
                            placeholderTextColor={COLORS.PLACEHOLDERS_COLOR}
                            value={paymentAmount}
                            keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                            maxLength={20}
                            editable={isLogin ? false : true}
                            autoCapitalize='none'
                            onChangeText={(text) => {
                                this.setState({
                                    paymentAmount: text.replace(/[- #*;,.<>\{\}\[\]\\\/]/gi, '')
                                })
                            }}
                            inputStyle={{
                                color: COLORS.GREY_COLOR,
                                fontSize: FONT.TextNormal,
                                fontFamily: FONT_FAMILY.MontserratRegular
                            }}
                        />
                    </InputContainer>
                    <Spacer space={4} />
                    <TextInputHeading >{'Paying For'}</TextInputHeading>
                    <Spacer space={2} />
                    <PleaseLoginText
                        style={{
                            justifyContent: 'flex-start',
                            width: wp("76%")
                        }}
                    >{payingFor}
                    </PleaseLoginText>
                </View>
                <Spacer space={4} />
                <ShadowViewContainer style={{ borderRadius: wp("8%") }}>
                    <NewPrimaryButton
                        btnText={'PROCEED'}
                        width={45}
                        borderRadius={wp("8%")}
                        verticalPaddingWithText={4}
                        isTextBold={true}
                        onPress={() => this.onProceedBtnPress()}
                    />
                </ShadowViewContainer>
                <Spacer space={2} />
            </CardContainerStyle>
        )
    };
    _renderCustomLoader = () => {
        const { isLoading } = this.state;
        return (
            <OrientationLoadingOverlay visible={isLoading} message="Loading.." />
        )
    };

    onProceedBtnPress() {
        const { paymentType, paymentAmount } = this.state
        const { navigate } = this.props.navigation;
        const { paymentSender, paymentReceiver, request_id, screen_type } = this.props.route.params;
        debugger
        if (paymentType.length === 0) {
            this.showToastAlert('Select payment type first.');
        } else if (paymentAmount.length === 0) {
            this.showToastAlert('Enter payable amount.')
        } else if (paymentAmount.length !== 0 && parseInt(paymentAmount) == 0) {
            this.showToastAlert('Enter a valid payable amount.')
        }
        else {
            if (this.isConnected()) {
                this.showDialog();
                PaymentApi({
                    "sender_id": paymentSender,
                    "receiver_id": paymentReceiver,
                    "amount": paymentAmount,
                    "payment_type": paymentType,
                    "request_id": request_id,
                    "payment_for": screen_type.toLowerCase() == 'login' || screen_type.toLowerCase() == 'doctor login' ? 'Registration' : 'Consultation'

                }, response => this.handlePaymentResponse(response, screen_type));
            } else {
                this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
            }
        }

    }

    handlePaymentResponse = (response, screen_type) => {
        debugger
        const { navigate } = this.props.navigation;
        const { params } = this.props.route;
        this.hideDialog()
        if (response !== undefined && response !== null) {
            if (response.code === 200) {
                console.log(response.data)
                this.hideDialog()
                if (response.data !== undefined && response.data !== null && response.data.length !== 0) {
                    // this.showToastSucess(response.message)
                    navigate("PaymentWeb", {
                        url: response.data.paymenntUrl,
                        fromScreen: screen_type.toString(),
                        userData: screen_type.toLowerCase() === 'login' || screen_type.toLowerCase() === 'doctor login' ? params.loginData : null
                    })
                }
            } else if (response.code === 204) {
                this.hideDialog()
                this.showToastAlert(response.message);
            } else if (response.code === 400) {
                this.hideDialog()
                this.showToastAlert(response.message);
            } else if (response.code === 401) {
                this.hideDialog()
                this.showToastAlert(response.message);
            } else if (response.code === 500) {
                this.hideDialog()
                this.showToastAlert(STRINGS.SERVER_ERROR);
            } else if (response.code === 502) {
                this.hideDialog()
                this.showToastAlert(response.data.message);
                // this.showToastAlert(response.message);
                console.log('failed response', response)
                // navigate("PaymentWeb", {
                //     url: response.data.paymenntUrl,
                //     fromScreen: screen_type.toString()
                // })
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

    render() {
        const { navigation } = this.props;
        const { navigate } = navigation;
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
                            <MainContainer
                                onTouchEnd={() => {
                                    if (this.isVisible === true) {
                                        this.controller.close()
                                    }
                                }}>
                                <CurvedImageBackground />
                                <AbsoluteContainer>
                                    <View style={{ width: wp("90%") }}>
                                        <AntDesign
                                            name={"arrowleft"}
                                            color={COLORS.WHITE_COLOR}
                                            size={30}
                                            onPress={() => navigation.pop()}
                                        />
                                    </View>
                                    <Spacer space={7} />
                                    <AppIconImageComponent />
                                    <FillInfoTextComponent />
                                    <Spacer space={4} />
                                    {this._renderCardView()}
                                </AbsoluteContainer>
                                <Spacer space={4} />
                            </MainContainer>
                            {this._renderCustomLoader()}
                        </ScrollContainer>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </SafeAreaViewContainer>
        )
    }
}

