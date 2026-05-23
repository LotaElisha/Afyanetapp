import React from "react";
import { Header } from "react-native-elements";
import AntDesign from "react-native-vector-icons/AntDesign";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
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
import { MainContainer, SafeAreaViewContainer, ScrollContainer } from "../../../utils/BaseStyles";
import {
    BackgroundImageUpperContainer, ContactContainer,
    ContactDetailsText, ContactRightContainer, EmailText, ExtraDetailsText,
    LowerText,
    PharmacyBackground,
    PharmacyNameText,
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
import { GetPharmacyDetails } from "../../../redux/actions/GetPharmacyAction";
import OrientationLoadingOverlay from "../../../utils/CustomLoader";
import { GetMedicalPrescriptionApi } from "../../../redux/actions/PrescriptionAction";
import { NewPrimaryButton } from '../../../components/buttons/primaryButton'
import { MedicineOrderApi } from "../../../redux/actions/PlaceOrderAction";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as _ from "lodash";
import NoDataFoundComponent from "../../../components/noDataFoundComponent";


class PharmacyDetails extends BaseClass {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            pharmacyName: "",
            contactName: "",
            contactEmail: "",
            contactAddress: "",
            contactPhone: "",
            prescriptionId: this.props.route.params.prescription_Id,
            isPrescription: this.props.route.params.prescription_Id == 0 ? false : true,
            medicineList: [],
            infoList: [],
            requestStatus: '',
            isRequested: false,
            rejectionNote: '',
            id: '',
            totalAmount: '',
            prescriptionUrl: '',
            payment_status: '',
            payment_status_mode: ''
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
        const { isPrescription, prescriptionId } = this.state;
        if (this.isConnected()) {
            this.showDialog();
            GetPharmacyDetails({
                id: id,
                token: token
            }, response => this.handleGetPharmacyDetailsResponse(response))
            if (isPrescription) {
                GetMedicalPrescriptionApi({
                    id: prescriptionId,
                    caretaker_id: user_Id,
                    pharmacy_id: id,
                    token: token
                }, response => this.handlePrescriptionResponse(response))
            }
        } else {
            this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
        }
    }

    handlePrescriptionResponse = (response) => {
        debugger
        if (response !== undefined && response !== null) {
            this.hideDialog();
            if (response.code === 200) {
                if (response.data !== undefined) {
                    this.setState({
                        medicineList: response.data,
                        totalAmount: response.total !== undefined ? response.total : 'N/A'
                    })
                    let copy = _.cloneDeep(response.data)
                    let tempArray = [];
                    _.map(copy, (item, index) => {
                        let testInfo = item.medicine_name.toString()
                        tempArray.push(testInfo)
                    })
                    this.setState({ infoList: tempArray })
                    debugger
                    if (response.pharmacy_request_data !== undefined && response.pharmacy_request_data !== null) {
                        this.setState({
                            isRequested: true,
                            requestStatus: response.pharmacy_request_data.status,
                            prescriptionUrl: response.pharmacy_request_data.upload_report,
                            payment_status: response.pharmacy_request_data.payment_status != null ? response.pharmacy_request_data.payment_status : '',
                            payment_mode_status: response.pharmacy_request_data.payment_status_mode
                        })
                    }
                }
            } else if (response.code === 204) {
                this.hideDialog()
                this.setState({
                    medicineList: []
                })
                this.showToastAlert(response.message);
            } else if (response.code === 400) {
                this.hideDialog()
                this.setState({
                    medicineList: []
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
                <Image style={{ height: wp('10%'), width: wp('10%') }} source={PHARMACY_DETAILS_IMAGES.MEDICINE_ICON} resizeMode={'contain'} />

                <Text style={{
                    color: COLORS.BLACK_COLOR,
                    fontSize: FONT.TextNormalX,
                    fontFamily: FONT_FAMILY.PoppinsRegular,
                    width: wp("60%"),
                    marginLeft: wp(2)
                }}>{item.medicine_name}</Text>
                <Text style={{
                    color: COLORS.APP_THEME_COLOR,
                    fontSize: FONT.TextNormalX,
                    fontFamily: FONT_FAMILY.PoppinsRegular,
                    width: wp("20%")
                }} >{item.price !== undefined ? '$' + item.price : 'N/A'}</Text>
            </View>

        )
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
        const { medicineList, isRequested, requestStatus, rejectionNote, prescriptionUrl, payment_status } = this.state
        const { navigation } = this.props
        return (
            <View style={{ alignContent: 'center', justifyContent: 'center' }}>
                {requestStatus == "completed" &&
                    <View>
                        <Spacer space={2} />
                        <NameText>{'View Bill Report'}</NameText>
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
                <NameText>Medicine Name</NameText>
                <Spacer space={1.5} />
                <View style={{ height: wp('65%') }}>
                    {(medicineList.length !== 0)
                        ?
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={medicineList}
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
                            }}>{rejectionNote !== undefined && null ? rejectionNote : 'N/A'}
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

    onProceedPress() {
        const { token, id, prescription_Id, user_Id } = this.props.route.params;
        const { infoList, requestStatus, totalAmount } = this.state;
        const { navigation } = this.props;
        const { navigate } = navigation;
        if (requestStatus === 'completed') {
            //change params
            if (totalAmount > 0) {
                navigate("PaymentScreen", {
                    paymentSender: user_Id,
                    paymentReceiver: id,//pharmacy_id
                    request_id: prescription_Id,//prescription_Id
                    screen_type: 'Pharmacy',
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
                        MedicineOrderApi({
                            patient_id: userData.user_data.id,
                            caretaker_id: userData.user_data.id,
                            prescription: infoList,
                            pharmacy_id: id,
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
        const { navigation } = this.props;
        const { navigate } = navigation;
        if (response !== undefined && response !== null) {
            this.hideDialog();
            if (response.code === 200) {
                if (response.data !== undefined) {
                    this.showToastSucess(response.message)
                    navigate('Pharmacy',
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

    handleGetPharmacyDetailsResponse = (response) => {
        if (response !== undefined && response !== null) {
            this.hideDialog();
            if (response.code === 200) {
                if (response.data !== undefined) {
                    this.setState({
                        pharmacyName: response.data.pharmacy_data.pharmacy_name,
                        contactName: response.data.name,
                        contactEmail: response.data.email,
                        contactAddress: response.data.address,
                        contactPhone: response.data.phone_number
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
                        name={"left"}
                        color={COLORS.BLACK_COLOR}
                        size={wp(5)}
                        onPress={() => navigation.goBack()} />
                )}
                centerComponent={{
                    text: STRINGS.PHARMACY_DETAILS_TITLE_TEXT, style: {
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

    _renderCustomLoader = () => {
        const { isLoading } = this.state;
        return (
            <OrientationLoadingOverlay visible={isLoading} message="Loading.." />
        )
    };

    render() {
        const { pharmacyName, contactName, contactEmail, contactAddress, contactPhone, isPrescription, isRequested, requestStatus } = this.state;
        return (
            <SafeAreaViewContainer>
                {this._renderHeader()}
                <ScrollContainer keyboardShouldPersistTaps={"handled"}
                    bounces={false}>
                    <MainContainer>
                        <PharmacyBackground source={PHARMACY_DETAILS_IMAGES.PHARMACY_DETAILS_BACKGROUND_IMAGE}>
                            <BackgroundImageUpperContainer>
                                <UpperText>Best {<UpperText
                                    style={{ color: COLORS.APP_THEME_COLOR }}>Pharmacy</UpperText>} In Area</UpperText>
                                <Spacer space={.5} />
                                <LowerText>{STRINGS.ALL_MEDICINES_AVAILABLE_TEXT}</LowerText>
                            </BackgroundImageUpperContainer>
                        </PharmacyBackground>
                        <Spacer space={2} />
                        <PharmacyNameText>{pharmacyName}</PharmacyNameText>
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
                        <Spacer space={1} />
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

export default PharmacyDetails
