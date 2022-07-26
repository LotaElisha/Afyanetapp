import React, { Component } from "react";
import { Image, View, TouchableOpacity, Text } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

import { MainContainer, SafeAreaViewContainer, ScrollContainer } from "../../../utils/BaseStyles";
import BaseClass from "../../../utils/BaseClass";
import { DOCTOR_MODULE_IMAGES } from "../../../utils/ImagePaths";
import { Spacer } from "../../../components/spacer";
import COLORS from "../../../themes/Colors";

import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {
    ImageBackgroundComponent,
    CardContainerStyle,
    AbsoluteContainer,
    VerticalRowView,
    HorizontalRowView,
    RoundImageContainer,
    BlueTextBox, DetailsContainer,
    WhiteText,
    NameText,
    BlueText,
    GreyText,
    BlueBoldText,
    GreyBoldText,

} from "./styles.js";
import { NewPrimaryButton } from "../../../components/buttons/primaryButton";
import { FONT_FAMILY } from "../../../themes/FontFamilies";
import STRINGS from "../../../utils/Strings";
import { FONT } from "../../../themes/FontSizes";
import AsyncStorage from "@react-native-community/async-storage";
import OrientationLoadingOverlay from "../../../utils/CustomLoader";
import {
    ChangeConsultationRequestStatusApi,
    GetConsultationRequestDetailsApi
} from "../../../redux/actions/DoctorConsultationActions";
import { CommonActions } from "@react-navigation/native";
import { Header } from 'react-native-elements'
import { GetChatHistoryApi } from "../../../redux/actions/getChatHistoryAction";
import {
    TimeText,
    MessageBubbleLeft,
    MessageBubbleRight,
    MessageBubbleTextLeft,
    MessageBubbleTextRight,
    MessageBubbleMediaMessage,
    MessageBubbleReportMessage,
    PrescriptionTitleText,
    PrescriptionText,
} from "../consultationScreen/styles";
import Progress from 'react-native-progress/Circle';
import { IMAGE_BASE_URL } from '../../../redux/constants'

export default class ConsultationHistoryDetails extends BaseClass {

    constructor(props) {
        super(props);
        this.state = {
            isActive: false,
            id: "",
            token: "",
            isLoading: false,
            drugHistory: "",
            pastDiseases: "",
            surgeryAndCompilations: "",
            age: "",
            patientName: "",
            bloodGroup: "",
            charges: "",
            message: "",
            isCareTaker: false,
            careTakerName: "",
            relation: "",
            senderId: '',
            messages: [],
            isPress: false,
            user_distance: '',
            user_image: ''
        }
    }

    getEntireChat = () => {
        const { token, senderId, receiverId } = this.state;
        const { data } = this.props.route.params;
        console.warn("info", data, senderId)
        GetChatHistoryApi({
            token: token,
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
                        name={"arrowleft"}
                        color={COLORS.BLACK_COLOR}
                        size={30}
                        onPress={() => navigation.pop()}
                    />
                )}
                centerComponent={{
                    text: 'History', style: {
                        color: COLORS.LIGHT_BLACK_COLOR,
                        fontSize: FONT.TextNormalX,
                        fontFamily: FONT_FAMILY.PoppinsSemiBold
                    }
                }}

                containerStyle={{
                    backgroundColor: COLORS.TRANSPARENT,
                    borderBottomColor: COLORS.TRANSPARENT,
                    paddingTop: 0,
                    height: 60,
                }}
            />
        )
    };

    componentDidMount() {
        const { data } = this.props.route.params;
        AsyncStorage.getItem(STRINGS.LOGIN_DATA).then((result) => {
            let userData = JSON.parse(result);
            if (userData !== undefined && userData !== null) {
                this.setState({
                    id: data.id,
                    token: userData.token,
                    senderId: userData.user_data.id
                }, () => {
                    if (this.isConnected()) {
                        this.showDialog();
                        GetConsultationRequestDetailsApi({
                            id: data.id,
                            token: userData.token,
                            addressTo: userData.user_data.street_name
                        }, response => this.handleConsultationRequestDetailsResponse(response))
                    } else {
                        this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
                    }

                })
            }
        }).catch((error) => {
            console.log(error)
        })
            .done();
    }


    handleConsultationRequestDetailsResponse = (response) => {
        if (response !== undefined && response !== null) {
            this.hideDialog();
            console.warn("pop", response)
            if (response.code === 200) {
                if (response.data.length !== 0) {
                    this.setState({
                        drugHistory: response.data[0].patient_detail_data !== null && response.data[0].patient_detail_data.drug_history !== null ? response.data[0].patient_detail_data.drug_history : "",
                        pastDiseases: response.data[0].patient_detail_data !== null && response.data[0].patient_detail_data.post_diseases !== null ? response.data[0].patient_detail_data.post_diseases : "",
                        surgeryAndCompilations: response.data[0].patient_detail_data !== null && response.data[0].patient_detail_data.surgery_complication !== null ? response.data[0].patient_detail_data.surgery_complication : "",
                        age: response.data[0].patient_detail_data !== null && response.data[0].patient_detail_data.age !== null ? response.data[0].patient_detail_data.age : "",
                        patientName: response.data[0].patient_user_data !== null && response.data[0].patient_user_data.name !== null ? response.data[0].patient_user_data.name : "",
                        bloodGroup: response.data[0].patient_user_data !== null && response.data[0].patient_user_data.blood_group_name !== null ? response.data[0].patient_user_data.blood_group_name : "",
                        charges: response.data[0].charges !== null ? response.data[0].charges : "",
                        message: response.data[0].caretaker_message,
                        isCareTaker: response.data[0].consulted_for === "other" ? true : false,
                        careTakerName: response.data[0].care_taker_data.name,
                        relation: response.data[0].patient_detail_data !== null && response.data[0].patient_detail_data.relation !== null ? response.data[0].patient_detail_data.relation : "",
                        user_image: response.data[0].care_taker_data.profile_image_path != null ? response.data[0].care_taker_data.profile_image_path : '',
                        user_distance: response.data[0].care_taker_data.distance != null ? response.data[0].care_taker_data.distance : '0',
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
            } else {
                this.hideDialog()
                this.showToastAlert(STRINGS.UNKNOWN_ERROR);
            }
        } else {
            this.hideDialog()
            this.showToastAlert(STRINGS.UNKNOWN_ERROR);
        }
    }


    _renderCustomLoader = () => {
        const { isLoading } = this.state;
        return (
            <OrientationLoadingOverlay visible={isLoading} message="Loading.." />
        )
    };

    render() {
        const { navigation } = this.props;
        const { navigate } = navigation;
        const { drugHistory, pastDiseases, relation, surgeryAndCompilations, age, patientName, bloodGroup, charges, message, isCareTaker, careTakerName,user_image,user_distance } = this.state;
        return (
            <SafeAreaViewContainer>
                <ScrollContainer style={{ backgroundColor: COLORS.TRANSPARENT }} keyboardShouldPersistTaps={"handled"}
                    bounces={false}>
                    <MainContainer style={{ backgroundColor: COLORS.TRANSPARENT }}>
                        {this._renderHeader()}
                        <CardContainerStyle>
                            <VerticalRowView>
                                <RoundImageContainer>
                                    <Image
                                        style={{ resizeMode: 'cover', height: wp(20), width: wp(20), borderRadius: wp(10),padding:5 }}
                                        source={user_image !== "" ? { uri: user_image } : DOCTOR_MODULE_IMAGES.DUMMY_DOCTOR_PICTURE} />
                                </RoundImageContainer>
                                <HorizontalRowView style={{ justifyContent: 'flex-start' }}>
                                    <NameText
                                        style={{ textAlign: 'left' }}>{patientName !== "" ? patientName : "NA"}</NameText>
                                    <BlueText>Blood Group - {bloodGroup !== "" ? bloodGroup : "NA"}</BlueText>
                                    <GreyText>Age - {age !== "" ? age + " Years" : "NA"}</GreyText>
                                    <VerticalRowView>
                                        <Ionicons name={'location-sharp'} size={22} color={'#EE3840'} />
                                        <GreyText>{user_distance} Away</GreyText>
                                        <Spacer row={5} />
                                        <BlueBoldText>{charges !== "" ? charges : ""}</BlueBoldText>
                                    </VerticalRowView>
                                    <Spacer space={1.5} />
                                    {isCareTaker &&
                                        <NewPrimaryButton
                                            color={COLORS.APP_THEME_COLOR}
                                            btnText={`Caretaker - ${careTakerName}`}
                                            width={46}
                                            disabled={true}
                                            textSize={FONT.TextSmall}
                                            verticalPaddingWithText={2.2}
                                            borderRadius={wp("1.6%")}
                                            onPress={() => console.log('')}
                                            fontFamily={FONT_FAMILY.PoppinsSemiBold}
                                        />
                                    }
                                    {isCareTaker &&
                                        <Spacer space={1.5} />
                                    }
                                </HorizontalRowView>
                            </VerticalRowView>
                            <DetailsContainer>
                                <GreyBoldText>{STRINGS.DRUG_HISTORY_TEXT}</GreyBoldText>
                                <GreyText>{drugHistory !== "" ? drugHistory : "NA"}</GreyText>
                                <GreyBoldText>{STRINGS.PAST_DISEASES_TEXT}</GreyBoldText>
                                <GreyText>{pastDiseases !== "" ? pastDiseases : "NA"}</GreyText>
                                <GreyBoldText>{STRINGS.SURGERY_COMPLICATIONS_TEXT}</GreyBoldText>
                                <GreyText>{surgeryAndCompilations !== "" ? surgeryAndCompilations : "NA"}</GreyText>
                                <GreyBoldText>Consulting For
                                        - {relation !== "" && isCareTaker ? relation : isCareTaker ? "NA" : "Self"}</GreyBoldText>
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
                                            isDoctor={true}
                                            direction={message.sender_id === this.state.senderId ? "right" : "left"}
                                            message={message}
                                            token={this.state.token}
                                            navigation={this.props.navigation}
                                        />
                                    )
                                }
                            </DetailsContainer>
                        </CardContainerStyle>

                    </MainContainer>

                </ScrollContainer>
            </SafeAreaViewContainer>
        )
    }
}


export class MessageBubble extends Component {


    ViewPrescription(type, id) {
        const { navigation } = this.props;
        const { navigate } = navigation;
        navigate('ViewPrescription',
            {
                presType: type,
                request_Id: id,
                token: this.props.token
            })
    }
    render() {
        //These spacers make the message bubble stay to the left or the right, depending on who is speaking, even if the message is multiple lines.
        var leftSpacer = this.props.direction === 'left' ? null : <Spacer row={0} />;
        var rightSpacer = this.props.direction === 'left' ? <Spacer row={0} /> : null;

        return (
            <View style={{ justifyContent: 'space-between', paddingHorizontal: 5, flexDirection: 'row' }}>
                {leftSpacer}
                {this.props.direction === 'left' ?
                    <MessageBubbleLeft>
                        {this.props.message.type == "1" ?

                            <MessageBubbleTextLeft>
                                {this.props.message.message}
                            </MessageBubbleTextLeft>

                            : this.props.message.type === "2" ? <MessageBubbleMediaMessage
                                indicator={Progress}
                                source={{ uri: this.props.message.file_path }} /> :
                                <MessageBubbleReportMessage style={{ flexDirection: 'row' }}>
                                    <View style={{ padding: wp(0.5) }} >
                                        <PrescriptionTitleText style={{ color: COLORS.WHITE_COLOR }} >{this.props.message.type === "4" ? 'Labs Test' : 'Medical Prescription'} </PrescriptionTitleText>
                                        <PrescriptionText style={{ textDecorationLine: 'underline', color: COLORS.WHITE_COLOR }}
                                            onPress={() => this.ViewPrescription(this.props.message.type, this.props.message.prescription_id)} >{this.props.message.type === "4" ? 'View Labs' : 'View Pharmacies'} </PrescriptionText>

                                    </View>
                                    <AntDesign
                                        name={"filetext1"}
                                        color={COLORS.WHITE_COLOR}
                                        size={wp(12)}
                                        onPress={() => this.ViewPrescription(this.props.message.type, this.props.message.prescription_id)}
                                    />
                                </MessageBubbleReportMessage>

                        }
                        <Spacer space={.5} />
                        <Text style={{
                            fontSize: FONT.TextSmall,
                            color: COLORS.WHITE_COLOR_SHADE
                        }}>{this.props.message.time.substr(0, 5)}</Text>
                    </MessageBubbleLeft>
                    :
                    <MessageBubbleRight>
                        {this.props.message.type === "1" ?
                            <MessageBubbleTextRight>
                                {this.props.message.message}
                            </MessageBubbleTextRight>
                            : this.props.message.type === "2" ? <MessageBubbleMediaMessage
                                indicator={Progress.Pie}
                                source={{ uri: this.props.message.file_path }} /> :
                                <MessageBubbleReportMessage style={{ flexDirection: 'row' }}>
                                    <View style={{ padding: wp(0.5) }} >
                                        <PrescriptionTitleText >{this.props.message.type === "4" ? 'Labs Test' : 'Medical Prescription'} </PrescriptionTitleText>
                                        <PrescriptionText style={{ textDecorationLine: 'underline', color: COLORS.APP_THEME_COLOR }}
                                            onPress={() => this.ViewPrescription(this.props.message.type, this.props.message.prescription_id)} >{this.props.message.type === "4" ? 'View Labs' : 'View Pharmacies'} </PrescriptionText>
                                    </View>
                                    <AntDesign
                                        name={"filetext1"}
                                        color={COLORS.APP_THEME_COLOR}
                                        size={wp(12)}
                                        onPress={() => this.ViewPrescription(this.props.message.type, this.props.message.prescription_id)}
                                    />
                                </MessageBubbleReportMessage>

                        }
                        <Spacer space={.5} />
                        <Text style={{
                            fontSize: FONT.TextSmall,
                            color: COLORS.LIGHT_BLACK_COLOR
                        }}>{this.props.message.time.substr(0, 5)}</Text>
                    </MessageBubbleRight>
                }
                {rightSpacer}
            </View>
        );
    }
}
