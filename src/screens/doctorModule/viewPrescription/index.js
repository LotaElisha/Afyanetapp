import React from "react";
import { Header } from "react-native-elements";
import AntDesign from "react-native-vector-icons/AntDesign";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

import { MainContainer, SafeAreaViewContainer, ScrollContainer } from "../../../utils/BaseStyles";

import BaseClass from "../../../utils/BaseClass";
import COLORS from "../../../themes/Colors";
import { PATIENT_HOME_SCREEN_IMAGES, PHARMACY_DETAILS_IMAGES } from "../../../utils/ImagePaths";
import { Spacer } from "../../../components/spacer";
import { ListIcon, NameText } from "../commonStyles";
import STRINGS from "../../../utils/Strings";
import { FONT } from "../../../themes/FontSizes";
import { FONT_FAMILY } from "../../../themes/FontFamilies";
import OrientationLoadingOverlay from "../../../utils/CustomLoader";
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
import { GetTestPrescriptionApi, GetMedicalPrescriptionApi } from "../../../redux/actions/PrescriptionAction";
import { TestOrderApi } from "../../../redux/actions/PlaceOrderAction";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as _ from "lodash";
import NoDataFoundComponent from "../../../components/noDataFoundComponent";

class ViewPrescription extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            testList: [],
            infoList: [],
            requestStatus: '',
            isRequested: false,
            rejectionNote: ''
        }
    }

    componentDidMount() {
        const { request_Id, token, presType } = this.props.route.params;
        if (this.isConnected()) {
            this.showDialog();
            // if (presType==3) {
            GetTestPrescriptionApi({
                id: request_Id,
                caretaker_id: 0,
                lab_id: 0,
                token: token
            }, response => this.handlePrescriptionResponse(response))
            // }
            // else {
            //     GetMedicalPrescriptionApi({
            //         id: request_Id,
            //         caretaker_id: 0,
            //         pharmacy_id: 0,
            //         token: token
            //     }, response => this.handlePrescriptionResponse(response))
            // }
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
                        testList: response.data
                    })
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
                    text: 'Prescription', style: {
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
        const { presType } = this.props.route.params;
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
                {presType == '3' &&
                    <Image
                        style={{ height: wp('10%'), width: wp('10%') }}
                        source={PHARMACY_DETAILS_IMAGES.MEDICINE_ICON}
                        resizeMode={'contain'} />
                }
                {presType == '3' &&
                    <Spacer row={1.5} />
                }
                <Text style={{
                    color: COLORS.BLACK_COLOR,
                    fontSize: FONT.TextNormalX,
                    fontFamily: FONT_FAMILY.PoppinsRegular,
                    width: wp("85%")
                }}>
                    {presType == 4 ? item.test_name : item.medicine_name}
                </Text>
            </View>

        )
    }

    _renderTestDetail() {
        const { testList } = this.state
        const { navigation } = this.props;
        const { presType } = this.props.route.params;
        return (
            <View style={{ alignContent: 'center', justifyContent: 'center' }}>
                <Spacer space={1.5} />
                <NameText>{presType == '4' ? 'Tests Name' : 'Medicines Name'}</NameText>
                <Spacer space={1.5} />
                {(testList.length !== 0)
                    ?
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={testList}
                        renderItem={({ item, index }) => this._renderItem(item, index)}
                    />
                    :
                    <NoDataFoundComponent title={"No Prescription available!"} />
                }
            </View>
        )
    }


    render() {
        return (
            <SafeAreaViewContainer>
                {this._renderHeader()}
                <ScrollContainer keyboardShouldPersistTaps={"handled"}
                    bounces={false}>
                    <MainContainer>
                        {this._renderTestDetail()}
                    </MainContainer>
                    {this._renderCustomLoader()}
                </ScrollContainer>
            </SafeAreaViewContainer>
        )
    }
}

export default ViewPrescription
