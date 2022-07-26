import React from "react";
import { Image, View } from "react-native";
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

} from "./styles";
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


export default class ConsultationRequest extends BaseClass {

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
            user_distance: '',
            user_image: ''
        }
    }

    componentDidMount() {
        const { data } = this.props.route.params;
        AsyncStorage.getItem(STRINGS.LOGIN_DATA).then((result) => {
            let userData = JSON.parse(result);
            if (userData !== undefined && userData !== null) {
                this.setState({
                    id: data.id,
                    token: userData.token
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

    handleChangeConsultationStatusResponse = (response, type) => {
        const { navigation } = this.props;
        debugger
        if (response !== undefined && response !== null) {
            this.hideDialog();
            if (response.code === 200) {
                if (type === "accepted") {
                    this.showToastSucess(STRINGS.REQUEST_ACCEPTED_SUCCESSFULLY)
                } else {
                    this.showToastSucess(STRINGS.REQUEST_REJECTED_SUCCESSFULLY)
                }
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

    onChangeStatus = (type) => {
        const { id, token } = this.state;
        if (this.isConnected()) {
            ChangeConsultationRequestStatusApi({
                id: id,
                token: token,
                status: type
            }, response => this.handleChangeConsultationStatusResponse(response, type))
        } else {
            this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
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
        const { drugHistory, pastDiseases, relation, surgeryAndCompilations, age, patientName, bloodGroup, charges, message, isCareTaker, careTakerName,user_distance,user_image } = this.state;
        return (
            <SafeAreaViewContainer>
                <ScrollContainer style={{ backgroundColor: COLORS.TRANSPARENT }} keyboardShouldPersistTaps={"handled"}
                    bounces={false}>
                    <MainContainer style={{ backgroundColor: COLORS.TRANSPARENT }}>
                        <ImageBackgroundComponent
                            source={DOCTOR_MODULE_IMAGES.CONSULTANTS_REQUEST_BG} />
                        <AbsoluteContainer>
                            <View style={{ width: wp("90%") }}>
                                <AntDesign
                                    name={"left"}
                                    color={COLORS.WHITE_COLOR}
                                    size={20}
                                    onPress={() => navigation.pop()}
                                />
                            </View>
                            <Spacer space={25} />
                            <CardContainerStyle>
                                <VerticalRowView>
                                    <RoundImageContainer>
                                        <Image
                                            style={{ resizeMode: 'cover', height: wp(20), width: wp(20), borderRadius: wp(10) }}
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
                                    <GreyBoldText>{STRINGS.MESSAGE_TEXT}</GreyBoldText>
                                    <GreyText>{message !== "" ? message : ""}</GreyText>
                                    <Spacer space={4} />
                                    <VerticalRowView style={{ justifyContent: "space-between" }}>
                                        <NewPrimaryButton
                                            color={COLORS.ACCEPT_REQUEST_COLOR}
                                            btnText={STRINGS.ACCEPT}
                                            width={37}
                                            textSize={FONT.TextSmall}
                                            verticalPaddingWithText={3}
                                            borderRadius={wp("6%")}
                                            onPress={() => this.onChangeStatus("accepted")}
                                            fontFamily={FONT_FAMILY.PoppinsSemiBold}
                                        />
                                        <NewPrimaryButton
                                            color={COLORS.REJECT_REQUEST_COLOR}
                                            btnText={STRINGS.REJECT}
                                            width={37}
                                            textSize={FONT.TextSmall}
                                            verticalPaddingWithText={3}
                                            borderRadius={wp("6%")}
                                            onPress={() => {
                                                navigate("CancelRequestModal", { id: this.state.id })
                                                // this.onChangeStatus("rejected")
                                            }}
                                            fontFamily={FONT_FAMILY.PoppinsSemiBold}
                                        />
                                    </VerticalRowView>
                                </DetailsContainer>
                            </CardContainerStyle>
                        </AbsoluteContainer>
                    </MainContainer>
                    {this._renderCustomLoader()}
                </ScrollContainer>
            </SafeAreaViewContainer>
        )
    }
}
