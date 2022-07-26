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
    TouchableOpacity,
    FlatList,
    Platform
} from "react-native";
import { AppIconImageComponent, FillInfoTextComponent } from "../../common/auth/authComponents";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { AUTH_IMAGES, DOCTOR_MODULE_IMAGES, DRAWER_ICONS } from "../../../utils/ImagePaths";
import {
    HorizontalRowView,
    RoundImageContainer,
    NameText,
    BlueText,
    GreyText,
    BlueBoldText,
    GreyBoldText,
    VerticalRowView,
    SpecializationText,
    DescriptionText,
    styles
} from "../consultationScreen/styles";
import { connect } from "react-redux";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Header, SearchBar } from "react-native-elements";
import { NewPrimaryButton } from "../../../components/buttons/primaryButton";
import AsyncStorage from "@react-native-community/async-storage";
import { GetTestListApi, TestSubmitApi } from "../../../redux/actions/PrescriptionAction";
import OrientationLoadingOverlay from "../../../utils/CustomLoader";
import DropDownPicker from "react-native-dropdown-picker";
import * as _ from "lodash";
import { getValueById } from "../../../utils/Helper";
import { BloodGroupOptionsData } from "../../../utils/CommonStaticData";

class TestPrescription extends BaseClass {
    static isDataAttached = false
    constructor(props) {
        super(props);
        this.state = {
            doctorName: "",
            age: "",
            patientName: "",
            bloodGroup: "",
            charges: "",
            message: "",
            accessToken: "",
            isLoading: false,
            selectedTest: '',
            testList: [],
            testInfoList: [],
            IsSearchbar: true,
            consultationRequestId: this.props.route.params.request_Id,
            senderId: this.props.route.params.doctor_Id,
            receiverId: this.props.route.params.opponent_Id,
            patientId: this.props.route.params.patient_id,
            consultationDetails: this.props.route.params.data,
        }
        this.isVisible = false;
        this.controller1;

    }

    componentDidMount() {
        AsyncStorage.getItem(STRINGS.LOGIN_DATA).then((result) => {
            let userData = JSON.parse(result);
            if (userData !== undefined && userData !== null) {
                this.setState({ accessToken: userData.token });
                if (this.isConnected()) {
                    const { accessToken } = this.state;
                    this.showDialog();
                    GetTestListApi({
                        'token': accessToken
                    }, response => this.HandleTestResponse(response))

                } else {
                    this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
                }
            }
        });
    }

    HandleTestResponse = (response) => {
        if (response !== undefined && response !== null) {
            if (response.code === 200) {
                this.hideDialog()
                if (response.data !== undefined && response.data !== null && response.data.length !== 0) {

                    let copy = _.cloneDeep(response.data)
                    let tempArray = [];
                    _.map(copy, (item, index) => {
                        let testInfo = {
                            'id': item.id,
                            'label': item.service_name,
                            'value': item.service_name,
                        }
                        tempArray.push(testInfo)
                    })
                    this.setState({ testInfoList: tempArray })

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
    _renderItem = (item, index) => {
        return (
            <View style={{
                width: wp("90%"),
                paddingVertical: wp("3.5%"),
                paddingHorizontal: wp("2%"),
                alignItems: 'center',
                backgroundColor: COLORS.WHITE_COLOR_SHADE,
                marginBottom: wp("4%"),
                borderRadius: wp("3%"),
            }}>
                <Text style={{
                    color: COLORS.BLACK_COLOR,
                    fontSize: FONT.TextNormalX,
                    fontFamily: FONT_FAMILY.PoppinsRegular,
                    width: wp("85%")
                }}>
                    {item.test_name}
                </Text>
            </View>

        )
    }

    _renderSearchBar() {
        const { testInfoList, testList } = this.state;
        return (
            <View style={{
                width: wp("90%"),
                alignItems: 'center',
                flexDirection: 'row',
                ...(Platform.OS !== "android" && {
                    zIndex: 10,
                }),
            }}>
                {
                    Platform.OS === 'android' ?
                        <View style={{
                            width: wp(90),
                        }}>
                            <DropDownPicker
                                items={testInfoList}
                                searchable={true}
                                searchablePlaceholder="Search for Test Name"
                                searchableError={() => <Text>Not Found</Text>}
                                controller={instance => this.controller1 = instance}
                                placeholder={'Test Name'}
                                onOpen={() => this.isVisible = true}
                                onClose={() => this.isVisible = false}
                                containerStyle={{
                                    width: wp("85%")
                                }}
                                style={{
                                    paddingLeft: 5,
                                    paddingRight: wp("1%"),
                                    paddingBottom: wp("2.5%"),
                                    paddingTop: wp("3.5%"),
                                    borderBottomWidth: 0,
                                    borderWidth: wp(0.1),
                                    backgroundColor: COLORS.LIGHT_BLUE_BACKGROUND_COLOR,
                                    borderColor: COLORS.TRANSPARENT,
                                }}
                                itemStyle={{
                                    justifyContent: 'flex-start',
                                }}
                                labelStyle={{
                                    color: COLORS.GREY_COLOR,
                                    fontSize: FONT.TextNormal,
                                    fontFamily: FONT_FAMILY.MontserratRegular
                                }}
                                placeholder={'Test Name'}
                                dropDownStyle={{ backgroundColor: COLORS.WHITE_COLOR }}
                                onChangeItem={item => {
                                    this.isVisible = false;
                                    this.setState({
                                        IsSearchbar: false
                                    })
                                    let testDetail = {
                                        'test_id': item.id,
                                        'test_name': item.label,
                                        'note': 'test'
                                    }
                                    testList.push(testDetail)
                                    let tempArray = []
                                    let copy = _.cloneDeep(this.state.testInfoList)
                                    _.map(copy, (item1, index1) => {
                                        if (item1.id === item.id) {
                                            console.log('item match')
                                        } else {
                                            tempArray.push(item1)
                                        }
                                    })
                                    this.setState({ testInfoList: tempArray })
                                }
                                }
                                selectedLabelStyle={{
                                    color: COLORS.GREY_COLOR,
                                    fontSize: FONT.TextNormal,
                                    fontFamily: FONT_FAMILY.MontserratRegular
                                }}
                                activeLabelStyle={{ color: COLORS.APP_THEME_COLOR }}
                                customArrowUp={() => <Image source={AUTH_IMAGES.DROP_DOWN_ICON} resizeMode={'contain'} />}
                                customArrowDown={() => <Image source={AUTH_IMAGES.DROP_DOWN_ICON} resizeMode={'contain'} />}
                            />
                        </View>
                        :
                        <DropDownPicker
                            items={testInfoList}
                            searchable={true}
                            searchablePlaceholder="Search for Test Name"
                            searchableError={() => <Text>Not Found</Text>}
                            controller={instance => this.controller1 = instance}
                            // defaultValue={userType}
                            onOpen={() => this.isVisible = true}
                            onClose={() => this.isVisible = false}
                            containerStyle={{
                                width: wp("85%"),
                                borderRadius: wp('6%'),
                                height: wp('12%'),
                                backgroundColor: COLORS.LIGHT_BLUE_BACKGROUND_COLOR,
                                borderColor: COLORS.TRANSPARENT,
                            }}
                            style={{
                                paddingLeft: 5,
                                paddingRight: wp("1%"),
                                paddingBottom: wp("2.5%"),
                                paddingTop: wp("3.5%"),
                                borderBottomWidth: 0,
                                borderWidth: wp(0.1),
                                backgroundColor: COLORS.TRANSPARENT,
                                borderColor: COLORS.TRANSPARENT,
                            }}
                            itemStyle={{
                                justifyContent: 'flex-start',
                            }}
                            labelStyle={{
                                color: COLORS.GREY_COLOR,
                                fontSize: FONT.TextNormal,
                                fontFamily: FONT_FAMILY.MontserratRegular
                            }}
                            placeholder={'Test Name'}
                            dropDownStyle={{ backgroundColor: COLORS.WHITE_COLOR }}
                            onChangeItem={item => {
                                this.isVisible = false;
                                this.setState({
                                    IsSearchbar: false
                                })
                                let testDetail = {
                                    'test_id': item.id,
                                    'test_name': item.label,
                                    'note': 'test'
                                }
                                testList.push(testDetail)
                                let tempArray = []
                                let copy = _.cloneDeep(this.state.testInfoList)
                                _.map(copy, (item1, index1) => {
                                    if (item1.id === item.id) {
                                        console.log('item match')
                                    } else {
                                        tempArray.push(item1)
                                    }
                                })
                                this.setState({ testInfoList: tempArray })
                            }
                            }
                            selectedLabelStyle={{
                                color: COLORS.GREY_COLOR,
                                fontSize: FONT.TextNormal,
                                fontFamily: FONT_FAMILY.MontserratRegular
                            }}
                            activeLabelStyle={{ color: COLORS.APP_THEME_COLOR }}
                            customArrowUp={() => <Image source={AUTH_IMAGES.DROP_DOWN_ICON} resizeMode={'contain'} />}
                            customArrowDown={() => <Image source={AUTH_IMAGES.DROP_DOWN_ICON} resizeMode={'contain'} />}
                        />
                }


                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: wp(8),
                    height: wp(16),
                    backgroundColor: COLORS.APP_THEME_COLOR,
                    position: 'absolute',
                    right: wp(1),
                    width: wp(20),
                }}>
                    <AntDesign
                        name={"search1"}
                        color={COLORS.WHITE_COLOR}
                        size={wp(8)} />
                </View>

            </View>
        );
    }

    onSubmitPress = () => {
        const { navigation } = this.props;
        const { navigate } = navigation;
        const { testList, accessToken, senderId, consultationRequestId, receiverId, patientId } = this.state;
        if (testList.length > 0) {
            if (this.isConnected()) {
                this.showDialog()
                TestSubmitApi({
                    'token': accessToken,
                    'doctor_id': senderId,
                    'caretaker_id': receiverId,
                    'test_name': testList,
                    'request_id': consultationRequestId,
                    'patient_id': patientId
                }, response => this.HandleSubmitResponse(response))
            } else {
                this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
            }
        }
        else {
            this.showToastAlert('Add test first.')
        }
    };

    HandleSubmitResponse = (response) => {
        const { navigation } = this.props;
        const { navigate } = navigation;
        debugger
        if (response !== undefined && response !== null) {
            if (response.code === 200) {
                this.hideDialog()
                if (response.data !== undefined && response.data !== null && response.data.length !== 0) {
                    console.log(response.data)
                    this.isDataAttached = true
                    navigate("ConsultationChatScreen",
                        {
                            comingFrom: "Uploads",
                            id: response.data.prescription_id,
                            type: 4
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
                        size={wp(7)}
                        onPress={() => navigation.goBack()} />
                )}
                centerComponent={{
                    text: STRINGS.MEDICAL_PRESCRIPTION_TITLE_TEXT, style: {
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

    _renderCustomLoader = () => {
        const { isLoading } = this.state;
        return (
            <OrientationLoadingOverlay visible={isLoading} message="Loading.." />
        )
    };

    AddMorePress = () => {
        const { IsSearchbar, testList } = this.state;
        if (testList.length == 0)
            this.showToastAlert('Add test first')
        if (!IsSearchbar)
            this.setState({
                IsSearchbar: !IsSearchbar
            })

    }

    render() {
        const { navigation } = this.props;
        const { age, bloodGroup, patientName, charges, testList, IsSearchbar, consultationDetails } = this.state;
        let patient_image = consultationDetails.care_taker_data.profile_image_path != null ? consultationDetails.care_taker_data.profile_image_path : ''
        return (
            <SafeAreaViewContainer style={{ backgroundColor: "transparent" }}>
                {this._renderHeader()}
                <ScrollContainer keyboardShouldPersistTaps={"handled"}>
                    <MainContainer onTouchEnd={() => {
                        if (this.isVisible === true) {
                            // this.controller1.close()
                        }
                    }}>

                        <VerticalRowView>
                            <RoundImageContainer>
                                <Image
                                    style={{ resizeMode: 'cover', height: wp(20), width: wp(20), borderRadius: wp(10) }}
                                    source={patient_image !== "" ? { uri: patient_image } : DOCTOR_MODULE_IMAGES.DUMMY_DOCTOR_PICTURE} />
                            </RoundImageContainer>

                            <HorizontalRowView style={{ justifyContent: 'flex-start' }}>
                                <NameText
                                    style={{ textAlign: 'left' }}>{consultationDetails.care_taker_data.name}</NameText>
                                <BlueText>Blood Group: {getValueById(BloodGroupOptionsData, consultationDetails.patient_detail_data.blood_group)}</BlueText>
                                <GreyText>Age: {consultationDetails.patient_detail_data.age} Years</GreyText>
                                <VerticalRowView>
                                    <Ionicons name={'location-sharp'} size={22} color={'#EE3840'} />
                                    <GreyText>{consultationDetails.distance + ' Away'}</GreyText>
                                    <Spacer row={5} />
                                    <BlueBoldText>{consultationDetails.charges !== "" && consultationDetails.charges !== null ? `$ ${consultationDetails.charges}` : ""}</BlueBoldText>
                                </VerticalRowView>
                            </HorizontalRowView>
                        </VerticalRowView>
                        <Spacer space={1.5} />
                        {consultationDetails.care_taker_data.user_type == "caretaker" &&
                            <NewPrimaryButton
                                color={COLORS.APP_THEME_COLOR}
                                btnText={`Caretaker - ${consultationDetails.care_taker_data.name}`}
                                width={46}
                                textSize={FONT.TextSmall}
                                verticalPaddingWithText={2.2}
                                borderRadius={wp("1.6%")}
                                fontFamily={FONT_FAMILY.PoppinsSemiBold}
                            />
                        }
                        {consultationDetails.care_taker_data.user_type == "caretaker" &&
                            <Spacer space={1.5} />
                        }
                        <Spacer space={2} />
                        <Text style={{
                            color: COLORS.BLACK_COLOR,
                            fontSize: FONT.TextNormalX,
                            fontFamily: FONT_FAMILY.PoppinsRegular,
                            width: wp("90%")
                        }}>
                            {STRINGS.TEST_PRESCRIPTION_TEXT}
                        </Text>
                        <Spacer space={2} />
                        <Text style={{
                            color: COLORS.BLACK_COLOR,
                            fontSize: FONT.TextNormalX,
                            fontFamily: FONT_FAMILY.PoppinsRegular,
                            width: wp("90%")
                        }}>
                            {STRINGS.TEST_PRESCRIPTION_TEST_NAME}
                        </Text>
                        <Spacer space={3} />
                        {IsSearchbar &&
                            this._renderSearchBar()
                        }
                        {IsSearchbar &&
                            <Spacer space={3} />
                        }
                        {/* <FlatList
                            showsVerticalScrollIndicator={false}
                            data={testList}
                            renderItem={({ item, index }) => this._renderItem(item, index)}
                        /> */}
                        {
                            testList.map((item, index) => {
                                return (
                                    this._renderItem(item, index)
                                )

                            })
                        }
                        <View style={{
                            justifyContent: 'flex-end', alignItems: 'flex-end',
                            width: wp('90%')
                        }}>
                            <NewPrimaryButton
                                color={COLORS.APP_THEME_COLOR}
                                btnText={STRINGS.MEDICAL_PRESCRIPTION_ADD_MORE}
                                width={18}
                                textSize={FONT.TextSmall}
                                verticalPaddingWithText={2.2}
                                borderRadius={wp("1.6%")}
                                onPress={() => this.AddMorePress()}
                                fontFamily={FONT_FAMILY.PoppinsSemiBold}
                            />
                        </View>
                        <Spacer space={10} />
                        <NewPrimaryButton
                            color={COLORS.APP_THEME_COLOR}
                            btnText={'SUBMIT'}
                            width={45}
                            textSize={FONT.TextMedium}
                            verticalPaddingWithText={2.2}
                            borderRadius={wp("8%")}
                            onPress={() => this.onSubmitPress()}
                            fontFamily={FONT_FAMILY.PoppinsSemiBold}
                        />
                        <Spacer space={2} />
                    </MainContainer>
                    {this._renderCustomLoader()}
                </ScrollContainer>
            </SafeAreaViewContainer>

        )
    }
}

export default TestPrescription;

