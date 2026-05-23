import React from "react";
import BaseClass from "../../../utils/BaseClass";
import {
    MainContainer,
    SafeAreaViewContainer,
    ScrollContainer,
    ShadowViewContainer
} from "../../../utils/BaseStyles";
import COLORS from "../../../themes/Colors";
import { Spacer } from "../../../components/spacer";
import STRINGS from "../../../utils/Strings";
import * as Validations from "../../../utils/validations";
import { FONT_FAMILY } from "../../../themes/FontFamilies";
import { FONT } from "../../../themes/FontSizes";
import {
    Keyboard,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    View,
    Text,
    StatusBar,
    Image,
    TouchableOpacity
} from "react-native";
import { AppIconImageComponent, FillInfoTextComponent } from "../../common/auth/authComponents";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { AUTH_IMAGES, DOCTOR_MODULE_IMAGES, DRAWER_ICONS } from "../../../utils/ImagePaths";
import {
    HorizontalRowView,
    RoundImageContainer,
    BlueTextBox, ChatContainer,
    CancelButton,
    WhiteText,
    NameText,
    BlueText,
    GreyText,
    BlueBoldText,
    GreyBoldText,
    VerticalRowView,
    DetailsContainer,
    SpecializationText,
    DescriptionText,
    styles
} from "./styles";
import { connect } from "react-redux";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Header } from "react-native-elements";
import { NewPrimaryButton } from "../../../components/buttons/primaryButton";
import { RatingView } from "../../../components/ratingComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DoctorDetailsApi } from "../../../redux/actions/DoctorDetailsAction";
import OrientationLoadingOverlay from "../../../utils/CustomLoader";
import ActiveIcon from "react-native-vector-icons/Octicons";
import { MessageBubble } from "../../doctorModule/consultationHistoryDetails";
import { GetChatHistoryApi } from "../../../redux/actions/getChatHistoryAction";
import { CardContainerStyle } from "../../doctorModule/consultationHistoryDetails/styles";


class HistoryDetails extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            doctorName: "",
            profileImage: "",
            charges: "",
            about: "",
            specialisation: "",
            qualification: "",
            isActive: "active",
            accessToken: "",
            isLoading: false,
            senderId: "",
            messages: [],
            isPress: false,
            doctorDistance: ''
        }
    }

    getEntireChat = () => {
        const { accessToken, senderId, receiverId } = this.state;
        const { data } = this.props.route.params;
        console.warn("info", data, senderId)
        GetChatHistoryApi({
            token: accessToken,
            sender_id: senderId,
            receiver_id: data.userId,
            request_id: data.id
        }, response => this.handleGetEntireChatResponse(response))
    }

    handleGetEntireChatResponse = (response) => {
        this.hideDialog()
        console.warn("res", response)
        if (response !== undefined && response !== null) {
            if (response.code === 200) {
                this.hideDialog()
                if (response.data !== undefined && response.data !== null && response.data.length !== 0) {
                    this.setState({
                        messages: response.data
                    })
                } else {
                    this.setState({
                        messages: []
                    })
                }
            } else if (response.code === 204) {
                this.hideDialog()
                this.setState({
                    messages: []
                })
                // this.showToastAlert(response.message);
            } else if (response.code === 400) {
                this.hideDialog()
                this.showToastAlert(response.message);
            } else if (response.code === 401) {
                this.hideDialog()
                this.showToastAlert(response.message);
            } else if (response.code === 500) {
                this.hideDialog()
                this.showToastAlert(STRINGS.SERVER_ERROR);
            } else {
                this.hideDialog()
                this.showToastAlert(STRINGS.UNKNOWN_ERROR);
            }
        } else {
            this.hideDialog()
            this.showToastAlert(STRINGS.UNKNOWN_ERROR);
        }
    }


    componentDidMount() {
        const { data } = this.props.route.params;
        console.warn("testdd", data)
        AsyncStorage.getItem(STRINGS.LOGIN_DATA).then((result) => {
            let userData = JSON.parse(result);
            if (userData !== undefined && userData !== null) {
                this.setState({
                    accessToken: userData.token,
                    senderId: userData.user_data.id
                });
                if (this.isConnected()) {
                    this.showDialog();
                    DoctorDetailsApi({
                        id: data.userId,
                        token: userData.token
                    }, response => this.handleDoctorDetailsApiResponse(response))
                } else {
                    this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
                }
            }
        });
    }


    handleDoctorDetailsApiResponse = (response) => {
        if (response !== undefined && response !== null) {
            console.warn("doctor", response)
            if (response.code === 200) {
                this.hideDialog()
                if (response.data !== undefined && response.data !== null && response.data.length !== 0) {
                    this.setState({
                        doctorName: response.data.name,
                        charges: response.data.charges,
                        about: response.data.about_info,
                        specialization: response.data.specialization,
                        qualification: response.data.qualification,
                        isActive: response.data.status,
                        profileImage: response.data.profile_image,
                        doctorDistance: response.data.distance != undefined ? response.data.distance : '0'
                    })
                } else {

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
            } else {
                this.hideDialog()
                this.showToastAlert(STRINGS.UNKNOWN_ERROR);
            }
        } else {
            this.hideDialog()
            this.showToastAlert(STRINGS.UNKNOWN_ERROR);
        }
    }



    _renderHeader = () => {
        const { navigation } = this.props;
        return (
            <Header
                backgroundColor={COLORS.WHITE_COLOR}
                barStyle={"dark-content"}
                statusBarProps={{
                    translucent: true,
                }}
                leftComponent={(
                    <AntDesign
                        name={"left"}
                        color={COLORS.BLACK_COLOR}
                        size={wp(5)}
                        onPress={() => navigation.goBack()} />
                )}
                centerComponent={{
                    text: "Consultation History", style: {
                        color: COLORS.LIGHT_BLACK_COLOR,
                        fontSize: FONT.TextNormalX,
                        fontFamily: FONT_FAMILY.PoppinsSemiBold
                    }
                }}

                containerStyle={{
                    backgroundColor: COLORS.TRANSPARENT,
                    borderBottomColor: COLORS.TRANSPARENT,
                    paddingTop: 0,
                    height: 65,
                }}
            />
        )
    };

    _renderWaveCard() {
        const { data } = this.props.route.params;
        const { charges, doctorName, isActive, profileImage, doctorDistance } = this.state;
        return (
            <View style={{ width: wp("90%"), backgroundColor: COLORS.WHITE_COLOR }}>
                <View style={{ width: wp("90%"), justifyContent: "center", alignItems: "center" }}>
                    <Image style={{ width: wp("90%"), height: wp(110) }} resizeMode={"stretch"}
                        source={profileImage !== "" ? { uri: this.state.profileImage } : DOCTOR_MODULE_IMAGES.DOCTOR_PROFILE_IMAGE} />
                    <View style={{
                        width: wp("23%"),
                        backgroundColor: "rgba(0, 0, 0, 0.15)",
                        borderRadius: 15,
                        flexDirection: "row",
                        position: "absolute",
                        top: 10,
                        left: 10,
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <ActiveIcon
                            name={"primitive-dot"}
                            size={30}
                            color={isActive === "active" ? COLORS.ACCEPT_REQUEST_COLOR : COLORS.LIGHT_GREY_COLOR}
                        />
                        <Spacer row={.5} />
                        <Text style={{
                            color: COLORS.WHITE_COLOR,
                            fontSize: FONT.TextSmallX,
                            fontFamily: FONT_FAMILY.PoppinsSemiBold
                        }}>{isActive}</Text>
                    </View>
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: wp("3%"),
                    width: wp(90)
                }}>
                    <View style={{ width: wp("64%") }}>
                        <NameText>DR {doctorName}</NameText>
                        <Spacer space={0.8} />
                        <RatingView
                            isDisable={true}
                            size={4.5}
                            rateCount={3}
                        />
                        <Spacer space={0.8} />
                        <View style={{ flexDirection: 'row' }}>
                            <Ionicons style={{ margin: 5 }} name={'location-sharp'} size={wp(5)} color={'#EE3840'} />
                            <GreyText>{doctorDistance} Away</GreyText>
                        </View>
                    </View>
                    <Spacer row={1} />
                    <View style={{ width: wp("18%"), justifyContent: "space-between", alignItems: "flex-end" }}>
                        <Image source={DOCTOR_MODULE_IMAGES.HEART_ICON} style={{ width: wp(15), height: wp(8) }} />
                        <BlueBoldText>$ {charges}</BlueBoldText>
                    </View>
                </View>
                <Spacer space={0.8} />
            </View>
        )
    }

    _renderCustomLoader = () => {
        const { isLoading } = this.state;
        return (
            <OrientationLoadingOverlay visible={isLoading} message="Loading.." />
        )
    };

    render() {
        const { navigation } = this.props;
        const { about, qualification } = this.state;
        return (
            <SafeAreaViewContainer style={{ backgroundColor: "transparent" }}>
                {this._renderHeader()}
                <ScrollContainer keyboardShouldPersistTaps={"handled"}>
                    <MainContainer style={{ backgroundColor: COLORS.WHITE_COLOR }}>

                        <Spacer space={3} />
                        {this._renderWaveCard()}
                        <Spacer space={5} />
                        <SpecializationText
                            style={{ width: wp("90%") }}>{STRINGS.DOCTOR_DETAILS_ABOUT_TEXT}</SpecializationText>
                        <Spacer space={1.5} />
                        <DescriptionText style={{ width: wp("90%") }}>{about}</DescriptionText>
                        <Spacer space={3.5} />
                        <SpecializationText
                            style={{ width: wp("90%") }}>{STRINGS.DOCTOR_DETAILS_QUALIFICATION_TEXT}</SpecializationText>
                        <Spacer space={1.5} />
                        <DescriptionText style={{ width: wp("90%") }}>{qualification}</DescriptionText>
                        <Spacer space={2} />
                        <DetailsContainer>
                            {!this.state.isPress && <GreyBoldText style={{ color: COLORS.APP_THEME_COLOR, textDecorationLine: "underline" }} onPress={() => {
                                this.setState({
                                    isPress: true
                                });
                                this.getEntireChat()
                            }
                            }>View Full Communication</GreyBoldText>}
                            {
                                this.state.messages.map((message) =>
                                    <MessageBubble
                                        isDoctor={false}
                                        direction={message.sender_id === this.state.senderId ? "right" : "left"}
                                        message={message}
                                        token={this.state.accessToken}
                                        navigation={this.props.navigation}
                                    />
                                )
                            }
                        </DetailsContainer>
                    </MainContainer>

                </ScrollContainer>
            </SafeAreaViewContainer>

        )
    }
}

export default HistoryDetails;

