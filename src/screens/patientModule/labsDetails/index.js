import React from "react";
import { Header } from "react-native-elements";
import AntDesign from "react-native-vector-icons/AntDesign";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

import { MainContainer, SafeAreaViewContainer, ScrollContainer } from "../../../utils/BaseStyles";
import {
    BackgroundImageUpperContainer, ContactContainer,
    ContactDetailsText, ContactRightContainer, EmailText, ExtraDetailsText,
    LowerText,
    PharmacyBackground,
    labNameText,
    UpperText
} from "./styles";
import BaseClass from "../../../utils/BaseClass";
import COLORS from "../../../themes/Colors";
import { PATIENT_HOME_SCREEN_IMAGES, PHARMACY_DETAILS_IMAGES } from "../../../utils/ImagePaths";
import { Spacer } from "../../../components/spacer";
import { ListIcon, NameText } from "../commonStyles";
import STRINGS from "../../../utils/Strings";
import { FONT } from "../../../themes/FontSizes";
import { FONT_FAMILY } from "../../../themes/FontFamilies";
import { GetLabsDetails } from "../../../redux/actions/GetPharmacyAction";
import OrientationLoadingOverlay from "../../../utils/CustomLoader";
import { PharmacyNameText } from "../pharmacyDetails/styles";
import { NewPrimaryButton } from '../../../components/buttons/primaryButton'
import {
    Keyboard,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    View,
    Text,
    StatusBar,
    Image,
    TouchableOpacity,
    FlatList
} from "react-native";
import { GetTestPrescriptionApi } from "../../../redux/actions/PrescriptionAction";
import { TestOrderApi } from "../../../redux/actions/PlaceOrderAction";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as _ from "lodash";
import NoDataFoundComponent from "../../../components/noDataFoundComponent";

class LabDetails extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            labName: "",
            contactName: "",
            contactEmail: "",
            contactAddress: "",
            contactPhone: "",
            prescriptionId: this.props.route.params.prescription_Id,
            isPrescription: this.props.route.params.prescription_Id == 0 ? false : true,
            testList: [],
            infoList: [],
            requestStatus: '',
            isRequested: false,
            rejectionNote: '',
            servicesList: [],
            totalAmount: '',
            prescriptionUrl: '',
            payment_status: '',
            payment_mode_status: ''
        }
    }

    //new code
    componentDidMount() {
        const { navigation } = this.props;
        this._unsubscribe = navigation.addListener('focus', () => {
            this.onFocusFunction();
        });
    }

    onFocusFunction = () => {
        this.hitApi()
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    hitApi = () => {
        const { id, token, user_Id } = this.props.route.params;
        console.warn(id)
        const { isPrescription, prescriptionId } = this.state;
        if (this.isConnected()) {
            this.showDialog();
            GetLabsDetails({
                id: id,
                token: token
            }, response => this.handleGetLabDetailsResponse(response))
            if (isPrescription) {
                GetTestPrescriptionApi({
                    id: prescriptionId,
                    caretaker_id: user_Id,
                    lab_id: id,
                    token: token
                }, response => this.handlePrescriptionResponse(response))
            }

        } else {
            this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
        }
    }

    _renderServices = (item, index) => {
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
                    {item}
                </Text>
            </View>
        )
    }

    handleGetLabDetailsResponse = (response) => {
        if (response !== undefined && response !== null) {
            this.hideDialog();
            if (response.code === 200) {
                if (response.data !== undefined) {
                    this.setState({
                        labName: response.data.lab_data.lab_name,
                        contactName: response.data.name,
                        contactEmail: response.data.email,
                        contactAddress: response.data.address,
                        contactPhone: response.data.phone_number,
                        servicesList: response.data.lab_services_list
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

    handlePrescriptionResponse = (response) => {
        debugger
        if (response !== undefined && response !== null) {
            this.hideDialog();
            if (response.code === 200) {
                if (response.data !== undefined) {
                    this.setState({
                        testList: response.data,
                        totalAmount: response.total !== undefined ? response.total : 'N/A'
                    })
                    let copy = _.cloneDeep(response.data)
                    let tempArray = [];
                    _.map(copy, (item, index) => {
                        let testInfo = item.test_id
                        tempArray.push(testInfo)
                    })
                    this.setState({ infoList: tempArray })

                    if (response.lab_request_data !== undefined && response.lab_request_data !== null) {
                        this.setState({
                            isRequested: true,
                            requestStatus: response.lab_request_data.status,
                            rejectionNote: response.lab_request_data.rejection_note,
                            prescriptionUrl: response.lab_request_data.upload_report,
                            payment_status: response.lab_request_data.payment_status != null ? response.lab_request_data.payment_status : '',
                            payment_mode_status: response.lab_request_data.payment_status_mode
                        })
                    }
                }
            } else if (response.code === 204) {
                this.hideDialog()
                this.setState({
                    testList: []
                })
                this.showToastAlert(response.message);
            } else if (response.code === 400) {
                this.hideDialog()
                this.setState({
                    testList: []
                })
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
                    text: STRINGS.LABS_DETAILS_TITLE_TEXT, style: {
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
                flexDirection: 'row'
            }}>
                <Text style={{
                    color: COLORS.BLACK_COLOR,
                    fontSize: FONT.TextNormalX,
                    fontFamily: FONT_FAMILY.PoppinsRegular,
                    width: wp("70%")
                }}>{item.test_name}</Text>
                <Text style={{
                    color: COLORS.APP_THEME_COLOR,
                    fontSize: FONT.TextNormalX,
                    fontFamily: FONT_FAMILY.PoppinsRegular,
                    width: wp("20%")
                }} >{item.price !== undefined ? '$' + item.price : 'N/A'}</Text>
            </View>
        )
    }

    onProceedPress() {
        const { id, token, prescription_Id, user_Id } = this.props.route.params;
        const { infoList, requestStatus, totalAmount } = this.state;
        const { navigation } = this.props;
        const { navigate } = navigation;
        debugger
        if (requestStatus === 'completed') {
            if (totalAmount > 0) {
                navigate("PaymentScreen", {
                    paymentSender: user_Id,
                    paymentReceiver: id,//lab_id
                    request_id: prescription_Id,//prescription_Id
                    screen_type: 'Labs',
                    consultation_fees: totalAmount
                })
            }
            else {
                this.showToastAlert('Nothing to pay')
            }
        }
        else if (requestStatus !== 'accepted') {
            if (this.isConnected()) {
                AsyncStorage.getItem(STRINGS.LOGIN_DATA).then((result) => {
                    let userData = JSON.parse(result);
                    if (userData !== undefined && userData !== null) {
                        this.showDialog();
                        TestOrderApi({
                            patient_id: userData.user_data.id,
                            caretaker_id: userData.user_data.id,
                            service_ids: infoList,
                            lab_id: id,
                            prescription_id: prescription_Id,
                            token: token
                        }, response => this.handleOrderResponse(response))
                    }
                });
            } else {
                this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
            }
        }

        else {

        }

    }

    handleOrderResponse = (response) => {
        debugger
        const { navigation } = this.props;
        const { navigate } = navigation;
        if (response !== undefined && response !== null) {
            this.hideDialog();
            if (response.code === 200) {
                if (response.data !== undefined) {
                    this.showToastSucess(response.message)
                    navigate('Labs',
                        {
                            request_Id: 0,
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

    renderTotal = () => {
        const { totalAmount } = this.state
        return (
            <View style={{
                width: wp("90%"),
                paddingVertical: wp("3.5%"),
                paddingHorizontal: wp("2%"),
                alignItems: 'center',
                backgroundColor: COLORS.WHITE_COLOR_SHADE,
                marginBottom: wp("4%"),
                borderRadius: wp("3%"),
                flexDirection: 'row'
            }}>
                <Text style={{
                    color: COLORS.BLACK_COLOR,
                    fontSize: FONT.TextNormalX,
                    fontFamily: FONT_FAMILY.PoppinsRegular,
                    width: wp("70%")
                }}>{'Total Amount'}</Text>
                <Text style={{
                    color: COLORS.APP_THEME_COLOR,
                    fontSize: FONT.TextNormalX,
                    fontFamily: FONT_FAMILY.PoppinsRegular,
                    width: wp("20%")
                }} >{'$' + totalAmount}</Text>
            </View>
        )
    }

    _renderTestDetail() {
        const { testList, isRequested, requestStatus, rejectionNote, prescriptionUrl, payment_status } = this.state
        const { navigation } = this.props;
        return (
            <View style={{ alignContent: 'center', justifyContent: 'center' }}>
                {requestStatus == "completed" &&
                    <View>
                        <Spacer space={2} />
                        <NameText>{'View Prescrition'}</NameText>
                        <Spacer space={2} />
                        <AntDesign
                            name={"filetext1"}
                            color={COLORS.APP_THEME_COLOR}
                            size={wp(15)}
                            onPress={() => navigation.navigate('Docsviewer',
                                {
                                    url: prescriptionUrl
                                }
                            )}
                        />
                        <Spacer space={2} />
                    </View>
                }
                <NameText>Tests Name</NameText>
                <Spacer space={1.5} />
                <View style={{ height: wp('70%') }}>
                    {(testList.length !== 0)
                        ?
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={testList}
                            renderItem={({ item, index }) => this._renderItem(item, index)}
                            ListFooterComponent={() => this.renderTotal()}
                        />
                        :
                        <NoDataFoundComponent title={"No History available!"} />
                    }
                </View>

                {/* rejection note view */}
                {requestStatus == "rejected" &&
                    <View>
                        <Text style={{
                            color: COLORS.BLACK_COLOR,
                            fontSize: FONT.TextNormal,
                            fontFamily: FONT_FAMILY.PoppinsSemiBold
                        }}>{'Rejection Note'}
                        </Text>
                        <Spacer space={1} />
                        <View style={{
                            width: wp("90%"),
                            paddingVertical: wp("3.5%"),
                            paddingHorizontal: wp("2%"),
                            alignItems: 'flex-start',
                            backgroundColor: COLORS.WHITE_COLOR_SHADE,
                            marginBottom: wp("4%"),
                            borderRadius: wp("3%"),
                        }}>
                            <Text style={{
                                color: COLORS.BLACK_COLOR,
                                fontSize: FONT.TextNormal,
                                fontFamily: FONT_FAMILY.PoppinsRegular
                            }}>{rejectionNote !== '' ? rejectionNote : 'N/A'}
                            </Text>
                        </View>
                        <Spacer space={2} />
                    </View>
                }
                <View style={{ alignContent: 'center', alignItems: 'center' }}>
                    {!isRequested ? <NewPrimaryButton
                        color={COLORS.APP_THEME_COLOR}
                        btnText={'PROCEED'}
                        width={55}
                        textSize={FONT.TextMedium}
                        verticalPaddingWithText={2.2}
                        borderRadius={wp("5%")}
                        onPress={() => this.onProceedPress()}
                        fontFamily={FONT_FAMILY.PoppinsSemiBold}
                    />
                        : isRequested && requestStatus == 'completed' && payment_status === '' ?
                            <NewPrimaryButton
                                color={COLORS.APP_THEME_COLOR}
                                btnText={'PROCEED TO PAY'}
                                width={55}
                                textSize={FONT.TextMedium}
                                verticalPaddingWithText={2.2}
                                borderRadius={wp("5%")}
                                onPress={() => this.onProceedPress()}
                                fontFamily={FONT_FAMILY.PoppinsSemiBold}
                            />
                            :
                            <NewPrimaryButton
                                color={COLORS.APP_THEME_COLOR}
                                btnText={'BACK'}
                                width={55}
                                textSize={FONT.TextMedium}
                                verticalPaddingWithText={2.2}
                                borderRadius={wp("5%")}
                                onPress={() => navigation.goBack()}
                                fontFamily={FONT_FAMILY.PoppinsSemiBold}
                            />
                    }
                </View>
                <Spacer space={2} />
            </View>
        )
    }


    render() {
        const { labName, contactName, contactEmail, contactAddress, contactPhone, isPrescription, isRequested, requestStatus, servicesList } = this.state;
        return (
            <SafeAreaViewContainer>
                {this._renderHeader()}
                <ScrollContainer keyboardShouldPersistTaps={"handled"}
                    bounces={false}>
                    <MainContainer>
                        <PharmacyBackground source={PHARMACY_DETAILS_IMAGES.PHARMACY_DETAILS_BACKGROUND_IMAGE}>
                            <BackgroundImageUpperContainer>
                                <UpperText>Best {<UpperText
                                    style={{ color: COLORS.APP_THEME_COLOR }}> Laboratory </UpperText>} In Area</UpperText>
                                <Spacer space={.5} />
                                <LowerText>{STRINGS.ALL_TEST_AVAILABLE_TEXT}</LowerText>
                            </BackgroundImageUpperContainer>
                        </PharmacyBackground>
                        <Spacer space={2} />
                        <PharmacyNameText>{labName}</PharmacyNameText>
                        <Spacer space={2} />
                        {isRequested &&
                            <View style={{
                                flexDirection: 'row', width: wp('90%'),
                                justifyContent: 'space-between',
                            }}>
                                <Text style={{
                                    color: COLORS.BLACK_COLOR,
                                    fontSize: FONT.TextNormal,
                                    fontFamily: FONT_FAMILY.PoppinsSemiBold
                                }}>{'Order Status'}</Text>
                                <Spacer row={1} />
                                <Text style={{
                                    color: COLORS.ACCEPT_REQUEST_COLOR,
                                    fontSize: FONT.TextNormal,
                                    fontFamily: FONT_FAMILY.PoppinsSemiBold
                                }}
                                >{requestStatus}</Text>

                            </View>
                        }
                        {isRequested &&
                            <Spacer space={2} />
                        }
                        <PharmacyNameText>{STRINGS.CONTACT_DETAILS}</PharmacyNameText>
                        <Spacer space={2} />
                        <ContactContainer>
                            <ListIcon
                                source={PATIENT_HOME_SCREEN_IMAGES.LIST_DOCTOR_ICON}
                            />
                            <Spacer row={2} />
                            <ContactRightContainer>
                                <NameText>Dr. {contactName}</NameText>
                                <Spacer space={2} />
                                <EmailText>{contactEmail}</EmailText>
                                <Spacer space={2} />
                                <ExtraDetailsText>{contactAddress}</ExtraDetailsText>
                                <Spacer space={2} />
                                <ExtraDetailsText>{contactPhone}</ExtraDetailsText>
                            </ContactRightContainer>
                        </ContactContainer>
                        {/* // available services view */}
                        <Spacer space={1} />
                        <PharmacyNameText>{'Available Services'}</PharmacyNameText>
                        <Spacer space={2} />
                        <View style={{ flex: 0.5 }}>
                            {(servicesList.length !== 0)
                                ?
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={servicesList}
                                    renderItem={({ item, index }) => this._renderServices(item, index)}
                                />
                                :
                                <NoDataFoundComponent title={"No Services available!"} />
                            }
                        </View>
                        {isPrescription &&
                            this._renderTestDetail()
                        }
                    </MainContainer>
                    {this._renderCustomLoader()}
                </ScrollContainer>
            </SafeAreaViewContainer>
        )
    }
}

export default LabDetails
