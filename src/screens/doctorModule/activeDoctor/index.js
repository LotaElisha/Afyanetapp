import BaseClass from "../../../utils/BaseClass";
import React from "react";
import { Image, View, TouchableOpacity, Text, Platform } from 'react-native'
import WavyHeader from '../component/waveView'
import { AUTH_IMAGES, DOCTOR_MODULE_IMAGES, DRAWER_ICONS } from "../../../utils/ImagePaths";

import Swiper from 'react-native-swiper'
import { MainContainer, ScrollContainer, SafeAreaViewContainer, ShadowViewContainer } from "../../../utils/BaseStyles";
import {
    NameText,
    GreyText,
    BlueBoldText,
    GreyBoldText,
    styles
} from "./styles";
import { Spacer } from "../../../components/spacer";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import STRINGS from "../../../utils/Strings";
import COLORS from "../../../themes/Colors";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Header } from "react-native-elements";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RatingView } from "../../../components/ratingComponent";
import { FONT } from "../../../themes/FontSizes";
import { NewPrimaryButton } from "../../../components/buttons/primaryButton";
import { FONT_FAMILY } from "../../../themes/FontFamilies";
import * as _ from 'lodash';
import ActiveIcon from "react-native-vector-icons/Octicons";

export default class ActiveDoctor extends BaseClass {

    constructor(props) {
        super(props)
        this.state = {
            isVisible: this.props.isModalVisible,
            data: this.props.data,
            doctorDetail: undefined,
            doctorName: "",
            charges: "",
            profileImage: "",
            isActive: "active",
            distance: ''
        };

    }

    componentDidMount() {
        this.shuffle(this.state.data)
    }

    //shuffle list
    shuffle(array) {
        let tempArray = _.shuffle(_.filter(array, (item) => {
            if (item.user.status === "active") {
                return item
            }
        }))
        this.setState({
            profileImage: tempArray[0].profile_image,
            doctorDetail: tempArray[0],
            doctorName: tempArray[0].user.name,
            charges: tempArray[0].charges,
            isActive: tempArray[0].user.status,
            distance: tempArray[0].distance
        })
    }

    closeModal = () => {
        this.props.closeModal();
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
                leftComponent={(<AntDesign
                    name={"left"}
                    color={COLORS.BLACK_COLOR}
                    size={wp(5)}
                    onPress={() => this.closeModal()}
                />)}
                centerComponent={{
                    text: STRINGS.ACTIVE_DOCTOR_TITLE_TEXT, style: {
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
        const { doctorDetail, doctorName, charges, isActive, profileImage, distance } = this.state;
        return (
            <View style={{ width: wp("90%"), backgroundColor: COLORS.WHITE_COLOR, }}>
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

    onViewProfilePress() {
        const { doctorDetail } = this.state;
        this.closeModal();
        this.props.onViewDetails(doctorDetail);
    }

    onStartConsultationPress() {
        const { doctorDetail } = this.state;
        this.closeModal();
        this.props.onStartConsultationPress(doctorDetail);
    }

    onOtherDoctorPress() {
        this.closeModal();
    }

    _renderButtons() {
        return (
            <View style={{
                flexDirection: 'column',
                width: wp("90%"),
                backgroundColor: COLORS.WHITE_COLOR,
                justifyContent: 'space-evenly',
                alignItems: 'center'
            }}>
                <Spacer space={2.5} />
                <NewPrimaryButton
                    btnText={STRINGS.ACTIVE_DOCTOR_VIEW_FULL_TEXT.toUpperCase()}
                    width={76}
                    borderRadius={wp("8%")}
                    verticalPaddingWithText={3.5}
                    isTextBold={true}
                    textSize={FONT.TextSmall}
                    onPress={() => this.onViewProfilePress()}
                />
                <Spacer space={3.5} />
                <NewPrimaryButton
                    btnText={STRINGS.ACTIVE_DOCTOR_START_CONSULTATION_TEXT.toUpperCase()}
                    width={75}
                    borderRadius={wp("8%")}
                    verticalPaddingWithText={3.5}
                    isTextBold={true}
                    textSize={FONT.TextSmall}
                    borderColor={COLORS.APP_THEME_COLOR}
                    color={COLORS.WHITE_COLOR}
                    textColor={COLORS.APP_THEME_COLOR}
                    onPress={() => this.onStartConsultationPress()}
                />
                <Spacer space={3.5} />
                <TouchableOpacity onPress={() => this.onOtherDoctorPress()}>
                    <BlueBoldText>{STRINGS.ACTIVE_DOCTOR_LOOKS_UP_TEXT}</BlueBoldText>
                </TouchableOpacity>
                <Spacer space={4} />
            </View>
        )
    }


    render() {
        if (Platform.OS === "ios") {
            return (
                <SafeAreaViewContainer>
                    {this._renderHeader()}
                    <ScrollContainer>
                        <MainContainer>
                            <Spacer space={2} />
                            {this._renderWaveCard()}
                            {this._renderButtons()}
                            <Spacer space={2.5} />
                        </MainContainer>
                    </ScrollContainer>
                </SafeAreaViewContainer>
            )
        } else {
            return (
                <View style={{ flex: 1 }}>
                    {this._renderHeader()}
                    <ScrollContainer keyboardShouldPersistTaps={"handled"}>
                        <MainContainer>
                            <Spacer space={2} />
                            {this._renderWaveCard()}
                            {this._renderButtons()}
                            <Spacer space={2.5} />
                        </MainContainer>
                    </ScrollContainer>
                </View>
            )
        }
    }
}

