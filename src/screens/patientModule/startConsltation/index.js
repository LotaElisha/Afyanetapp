import BaseClass from "../../../utils/BaseClass";
import React from "react";
import {
    Image,
    View,
    TouchableOpacity,
    Text,
    FlatList,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard, KeyboardAvoidingView
} from 'react-native'
import AsyncStorage from "@react-native-community/async-storage";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Header } from "react-native-elements";
import Ionicons from 'react-native-vector-icons/Ionicons'
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons'
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { connect } from "react-redux";

import { AUTH_IMAGES, COMMON_IMAGES, DOCTOR_MODULE_IMAGES, DRAWER_ICONS } from "../../../utils/ImagePaths";
import { FONT_FAMILY } from "../../../themes/FontFamilies";
import { MainContainer, SafeAreaViewContainer, ScrollContainer, ShadowViewContainer } from "../../../utils/BaseStyles";
import {
    NameText,
    BlueText,
    GreyText,
    BlueBoldText,
    GreyBoldText,
    WhiteText,
    VerticalRowView,
    styles
} from "./styles";
import {
    HorizontalListIcon, SpecializationText,
} from "../specializedDoctors/styles";
import {
    AutoGrowInput, InputBox, SmallButton,
} from "../../doctorModule/consultationScreen/styles";
import { Spacer } from "../../../components/spacer";
import STRINGS from "../../../utils/Strings";
import COLORS from "../../../themes/Colors";
import { RatingView } from "../../../components/ratingComponent";
import { FONT } from "../../../themes/FontSizes";
import { StartConsltationAction } from "../../../redux/actions/StartConsltationAction";
import { NewPrimaryButton } from "../../../components/buttons/primaryButton";
import { HeaderImage } from "../patientHome/styles";
import * as _ from "lodash";
import { CommonActions } from "@react-navigation/native";
import ActiveIcon from "react-native-vector-icons/Octicons";
import OrientationLoadingOverlay from "../../../utils/CustomLoader";
import { GetPatientApi } from "../../../redux/actions/GetAndDeletePatientAction";

class StartConsultation extends BaseClass {

    constructor(props) {
        super(props);
        this.state = {
            userId: "",
            charges: "",
            doctorName: "",
            profileImage: "",
            message: "",
            userType: "",
            consultingFor: [],
            token: "",
            isLoading: false,
            consultingForSelectedItem: "",
            isActive: 'active',
            distance: ''
        }
    }

    componentDidMount() {
        const { data } = this.props.route.params;
        AsyncStorage.getItem(STRINGS.LOGIN_DATA).then((result) => {
            let userData = JSON.parse(result);
            if (userData !== undefined && userData !== null) {
                let myItem = {
                    id: userData.user_data.id,
                    name: "Me",
                    relation: "Me",
                    isSelected: true,
                    details_added: false
                }
                let tempArray = [];
                tempArray.push(myItem);
                if (userData.additional_details.patients_detail !== undefined && userData.additional_details.patients_detail !== null && userData.additional_details.patients_detail.length !== 0) {
                    _.map(userData.additional_details.patients_detail, (item, index) => {
                        if (item.id !== userData.user_data.id) {
                            let myNewItem = {
                                id: item.user_id,
                                name: item.user.name,
                                relation: item.relation,
                                isSelected: false
                            }
                            tempArray.push(myNewItem)
                        }
                    })
                }
                this.setState({
                    userId: userData.user_data.id,
                    userType: userData.user_data.user_type,
                    token: userData.token,
                    consultingFor: tempArray,
                    charges: data.charges,
                    profileImage: data.profile_image,
                    doctorName: data.user.name,
                    isActive: data.user.status,
                    doctorId: data.user_id,
                    distance: data.distance,
                    consultingForSelectedItem: tempArray[0]
                });
            }
        });
    }

    componentWillReceiveProps(nextProps, nextContext) {
        debugger
        const { navigation } = this.props;
        const { startConsltationRespose } = nextProps.startConsltationState;
        if (startConsltationRespose !== undefined && startConsltationRespose !== null) {
            this.hideDialog();
            if (startConsltationRespose.code === 200 && startConsltationRespose.status === 'success') {
                this.hideDialog();
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
                this.showToastSucess(STRINGS.REQUEST_SENT_SUCCESSFULLY)
                this.hideDialog();

            } else if (startConsltationRespose.status === 401) {
                this.hideDialog();
                this.showToastAlert(startConsltationRespose.message);
            } else {
                this.hideDialog();
                console.log(startConsltationRespose.message)
                this.showToastAlert(startConsltationRespose.message);
            }
            this.hideDialog()
        } else {
            this.hideDialog()
        }
    }

    onSendPressed = () => {
        const { message, token, userId, consultingForSelectedItem, consultingFor, doctorId } = this.state;
        if (message.trim().length === 0) {
            this.showToastAlert(STRINGS.EMPTY_MESSAGE)
        } else if (consultingFor.length > 1 && consultingForSelectedItem.relation === "Me") {
            this.showToastAlert("Additional details of selcted person are not added yet, Please add.")
        } else if (this.isConnected()) {
            this.showDialog();
            this.props.startConsltationApi({
                message,
                token,
                userId,
                doctorId,
                consulted_for: consultingForSelectedItem.relation === "Me" ? "self" : "other",
                patient_id: consultingForSelectedItem.id
            })
        } else {
            this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
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
                    text: STRINGS.START_CONSULTATION_TITLE_TEXT, style: {
                        color: COLORS.LIGHT_BLACK_COLOR,
                        fontSize: FONT.TextNormalX,
                        fontFamily: FONT_FAMILY.PoppinsSemiBold
                    }
                }}
                rightComponent={(
                    <NewPrimaryButton
                        btnText={STRINGS.CANCEL}
                        color={COLORS.REJECT_REQUEST_COLOR}
                        width={22}
                        onPress={() => navigation.goBack()}
                        textSize={FONT.TextSmallX}
                        isTextBold={true}
                        borderRadius={wp("4%")}
                        verticalPaddingWithText={.5}
                    />
                )}
                containerStyle={{
                    backgroundColor: COLORS.TRANSPARENT,
                    borderBottomColor: COLORS.TRANSPARENT,
                    paddingTop: 0,
                    height: 65,
                }}
            />
        )
    };

    getPatientList = (userData) => {
        if (this.isConnected()) {
            this.showDialog();
            GetPatientApi(
                {
                    id: userData.user_data.id,
                    token: userData.token,
                },
                (response) => this.patientData(response)
            );
        }
        else {
            this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
        }
    };

    patientData = (response) => {
        this.hideDialog();
        if (response !== undefined && response !== null) {
            if (response.code === 200) {
                this.hideDialog();
                if (
                    response.data !== undefined &&
                    response.data !== null &&
                    response.data.length !== 0
                ) {
                    this.setState({
                        patientsList: response.data,
                    });
                } else {
                    this.setState({
                        patientsList: [],
                    });
                }
            } else if (response.code === 204) {
                this.hideDialog();
                this.showToastAlert(response.message);
            } else if (response.code === 400) {
                this.hideDialog();
                this.showToastAlert(response.message);
            } else if (response.code === 401) {
                this.hideDialog();
                this.showToastAlert(response.message);
            } else if (response.code === 500) {
                this.hideDialog();
                this.showToastAlert(STRINGS.SERVER_ERROR);
            } else {
                this.hideDialog();
                this.showToastAlert(STRINGS.UNKNOWN_ERROR);
            }
        } else {
            this.hideDialog();
            this.showToastAlert(STRINGS.UNKNOWN_ERROR);
        }
    };

    _renderSendMsg() {
        const { message } = this.state;
        return (
            <View style={{
                flexDirection: "row",
                paddingHorizontal: wp("2%"),
                paddingVertical: wp("2%"),
                width: wp("100%"),
                justifyContent: "space-between",
                alignItems: "flex-end"
            }}>
                <TextInput style={{
                    flex: 1,
                    borderColor: COLORS.APP_BACKGROUND_COLOR,
                    borderWidth: 1,
                    backgroundColor: "#f9f9f9",
                    paddingHorizontal: wp("2%"),
                    paddingTop: wp("3%"),
                    borderRadius: wp("4%"),
                    paddingBottom: wp("3%"),
                    color: COLORS.GREY_COLOR,
                    fontSize: FONT.TextNormal,
                    fontFamily: FONT_FAMILY.MontserratRegular
                }}
                    value={message}
                    onChangeText={(text) => this.setState({
                        message: text
                    })}
                    scrollEnabled={false}
                    placeholder={"Type a message here..."}
                    multiline={true}
                    onContentSizeChange={(e) => this.screenRef.scrollToEnd({ animated: true })}
                />
                <Spacer row={2} />
                <Ionicons
                    name="send-sharp"
                    size={30}
                    style={{ paddingVertical: wp("2%"), paddingHorizontal: wp("2%") }}
                    onPress={() => this.onSendPressed()}
                    color={COLORS.APP_THEME_COLOR} />
            </View>
        );
    }

    _renderWaveCard() {
        const { charges, doctorName, isActive, profileImage, distance } = this.state;
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
                            rateCount={0}
                        />
                        <Spacer space={0.8} />
                        <View style={{ flexDirection: 'row' }}>
                            <Ionicons style={{ margin: 5 }} name={'location-sharp'} size={wp(5)} color={'#EE3840'} />
                            <GreyText>{distance + ' Away'}</GreyText>
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

    onConsultingForSelect = (item, index) => {
        const { consultingFor } = this.state;
        let tempArray = []
        let copy = _.cloneDeep(consultingFor)
        _.map(copy, (item1, index1) => {
            if (index1 === index) {
                item1.isSelected = true
                tempArray.splice(0, 0, item1)
            } else {
                item1.isSelected = false
                tempArray.push(item1)
            }
        })
        this.setState({
            consultingFor: tempArray,
            consultingForSelectedItem: tempArray[0]
        })
        this.consultingForRef.scrollToIndex({ animated: true, index: 0 })
    }

    _renderHorizontalItem = (item, index) => {
        return (
            <TouchableOpacity delayPressIn={0} activeOpacity={1}
                onPress={() => this.onConsultingForSelect(item, index)}>
                <View style={{
                    height: wp("25%"),
                    width: wp("26%"),
                    marginLeft: wp("2%"),
                    backgroundColor: item.isSelected ? COLORS.APP_THEME_COLOR : COLORS.TRANSPARENT,
                    borderRadius: wp("1.5%"),
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <HeaderImage source={COMMON_IMAGES.DUMMY_USER_PROFILE_PIC} />
                    <Spacer space={1} />
                    {item.name === "Me" ?
                        <Text style={{
                            textAlign: "center",
                            color: item.isSelected ? COLORS.WHITE_COLOR : COLORS.LIGHT_BLACK_COLOR,
                            fontSize: FONT.TextSmall,
                            fontFamily: FONT_FAMILY.MontserratRegular
                        }}>{item.name}</Text>
                        :
                        <Text style={{
                            textAlign: "center",
                            color: item.isSelected ? COLORS.WHITE_COLOR : COLORS.LIGHT_BLACK_COLOR,
                            fontSize: FONT.TextSmall,
                            fontFamily: FONT_FAMILY.MontserratRegular
                        }}>{item.name}({item.relation})</Text>
                    }
                </View>
            </TouchableOpacity>
        )
    };


    _renderCustomLoader = () => {
        const { isLoading } = this.state;
        return (
            <OrientationLoadingOverlay visible={isLoading} message="Loading.." />
        )
    };


    render() {
        const { navigate } = this.props.navigation;
        return (
            <SafeAreaViewContainer style={{ backgroundColor: "transparent" }}>
                {this._renderHeader()}
                <KeyboardAvoidingView
                    style={{ flex: 1, backgroundColor: COLORS.APP_BACKGROUND_COLOR }}
                    behavior={(Platform.OS === 'ios') ? 'padding' : null}>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            Keyboard.dismiss()
                        }}>
                        <ScrollContainer keyboardShouldPersistTaps={'handled'} ref={(ref) => this.screenRef = ref}>
                            <MainContainer>
                                <Spacer space={2} />
                                {this._renderWaveCard()}
                                <Spacer space={4} />
                                <View style={{
                                    justifyContent: 'flex-start',
                                    width: wp(95),
                                    padding: wp(2),
                                }}>
                                    <SpecializationText>{STRINGS.START_CONSULTING_FOR_TEXT}</SpecializationText>
                                    <Spacer space={1.5} />
                                    <FlatList
                                        horizontal
                                        ref={(refs) => this.consultingForRef = refs}
                                        keyboardShouldPersistTaps={"handled"}
                                        showsHorizontalScrollIndicator={false}
                                        data={this.state.consultingFor}
                                        renderItem={({ item, index }) => this._renderHorizontalItem(item, index)}
                                        extraData={this.state}
                                    />
                                </View>
                                <Spacer space={2.5} />
                                {this._renderSendMsg()}
                            </MainContainer>
                            {this._renderCustomLoader()}
                        </ScrollContainer>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </SafeAreaViewContainer>
        )
    }
}

const mapStateToProps = state => ({
    startConsltationState: state.StartConsultationReducer,
});

// ----------------------------------------

const mapDispatchToProps = (dispatch) => {
    return {
        startConsltationApi: (payload) => dispatch(StartConsltationAction(payload)),
    };
};

// ----------------------------------------

export default connect(mapStateToProps, mapDispatchToProps)(StartConsultation);
