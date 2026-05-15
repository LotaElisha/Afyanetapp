import React from "react";
import { TextInput, Text, View, Image, StyleSheet, KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,Platform } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import COLORS from "../../themes/Colors";
import { FONT_FAMILY } from "../../themes/FontFamilies";
import { FONT } from "../../themes/FontSizes";
import STRINGS from "../../utils/Strings";
import BaseClass from "../../utils/BaseClass";
import { Spacer } from "../spacer";
import { TextInputHeadingComponent } from "../../screens/common/auth/authComponents";
import DropDownPicker from "react-native-dropdown-picker";
import { AUTH_IMAGES } from "../../utils/ImagePaths";
import * as _ from "lodash";
import { SpecializationsData } from "../../utils/CommonStaticData";
import { NewPrimaryButton } from "../buttons/primaryButton";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetAllDoctorListAction } from "../../redux/actions/GetAllDoctorAction";
import { ChangeConsultationRequestStatusApi } from "../../redux/actions/DoctorConsultationActions";
import { Dropdown } from '../../../local_modules/react-native-material-dropdown';
import { CommonActions } from "@react-navigation/native";

class CancelRequestModal extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            rejectionNote: "",
            selectedDoctor: '',
            doctorList: [],
            selectedDoctorId: '',
            token: '',
            id: '',
            userType: "",
        };
    }

    componentDidMount() {
        const { route } = this.props
        const { id } = route.params;
        AsyncStorage.getItem(STRINGS.LOGIN_DATA).then((result) => {
            let userData = JSON.parse(result);
            if (userData !== undefined && userData !== null) {
                this.setState({
                    token: userData.token,
                    id: id
                })
                if (this.isConnected()) {
                    this.showDialog();
                    this.props.getAllDoctorApi({
                        "token": userData.token,//change values
                    })
                } else {
                    this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
                }
            }
        }).catch((error) => {
            console.log(error)
        })
            .done();
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        const { getAllDoctorResponse } = nextProps.getAllDoctorState;
        if (getAllDoctorResponse !== undefined && getAllDoctorResponse !== null) {

            this.hideDialog();
            if (getAllDoctorResponse.code === 200 && getAllDoctorResponse.status === 'success') {
                this.hideDialog();
                let copy = _.cloneDeep(getAllDoctorResponse.data)
                let tempArray = [];
                _.map(copy, (item, index) => {
                    let doctor = {
                        'id': item.id,
                        'label': item.name,
                        'value': item.name,
                        'selected': false
                    }
                    tempArray.push(doctor)
                })
                this.setState({ doctorList: tempArray })
            } else if (getAllDoctorResponse.code === 204) {
                this.hideDialog()
                this.showToastAlert(response.message);
            } else if (getAllDoctorResponse.code === 400) {
                this.hideDialog()
                this.showToastAlert(response.message);
            } else if (getAllDoctorResponse.code === 401) {
                this.hideDialog()
                this.showToastAlert(response.message);
            } else if (getAllDoctorResponse.code === 500) {
                this.hideDialog()
                this.showToastAlert(STRINGS.SERVER_ERROR);
            } else {
                this.hideDialog()
                this.showToastAlert(STRINGS.UNKNOWN_ERROR);
            }
        } else {
            this.hideDialog();
            this.showToastAlert(STRINGS.UNKNOWN_ERROR);
        }

    }

    onSubmitPress = () => {
        const { id, token, selectedDoctor, selectedDoctorId, rejectionNote } = this.state;
        debugger
        if (this.isConnected()) {
            ChangeConsultationRequestStatusApi({
                'id': id,//id
                'status': 'rejected',
                'rejection_note': rejectionNote,
                'consult_another_doctor': selectedDoctorId,
                'token': token

            }, response => this.handleChangeConsultationStatusResponse(response))
        } else {
            this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
        }
    };

    handleChangeConsultationStatusResponse = (response) => {
        debugger
        console.warn('request action', response)
        const { navigation } = this.props;
        if (response !== undefined && response !== null) {
            this.hideDialog();
            if (response.code === 200) {
                this.hideDialog()
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
                this.showToastSucess(response.message);
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

    onClosePress = () => {
        const { navigation } = this.props;
        navigation.pop(1);
        // console.warn('close clicked')
        //close popup
    }

    render() {
        const { rejectionNote, selectedDoctor, doctorList, selectedDoctorId, userType } = this.state;

        return (
            // <KeyboardAvoidingView
            //     style={{ flex: 1 }}
            //     behavior={(Platform.OS === 'ios') ? 'padding' : null}>
                <TouchableWithoutFeedback
                    onPress={() => {
                        Keyboard.dismiss()
                    }}>
                    <View style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: COLORS.MODAL_BACKGROUND_COLOR
                    }}>
                        <View style={{
                            width: wp(90),
                            borderRadius: wp(1),
                            backgroundColor: COLORS.WHITE_COLOR,
                            justifyContent: "center",
                            paddingVertical: wp(4),
                            alignItems: "center"
                        }}>
                            <Text style={{
                                fontFamily: FONT_FAMILY.MontserratSemiBold,
                                color: COLORS.BLACK_COLOR,
                                fontSize: FONT.TextNormalX
                            }}>{STRINGS.ADD_REJECTION_NOTE}</Text>
                            <Spacer space={2} />
                            <View style={{
                                paddingHorizontal: 10,
                                paddingVertical: 3,
                                borderColor: COLORS.GREY_BORDER_COLOR,
                                borderWidth: 2,
                                borderRadius: 10,
                                width: wp(80),
                                height: hp(15)
                            }}>
                                <TextInput style={{
                                    flex: 1,
                                    color: COLORS.GREY_COLOR,
                                    fontSize: FONT.TextNormal,
                                    fontFamily: FONT_FAMILY.MontserratRegular
                                }}
                                    multiline
                                    maxLength={200}
                                    scrollEnabled={false}
                                    textAlignVertical={"top"}
                                    placeholder='Type Something...(upto 200 words)'
                                    numberOfLines={4}
                                    // returnKeyType={'done'}
                                    placeholderTextColor={COLORS.PLACEHOLDERS_COLOR}
                                    value={rejectionNote}
                                    autoCapitalize='none'
                                    onChangeText={(text) => {
                                        if (text.trim().length === 0) {
                                            this.setState({
                                                rejectionNote: text.trim()
                                            })
                                        } else {
                                            this.setState({
                                                rejectionNote: text
                                            })
                                        }
                                    }}
                                    // onSubmitPress={Keyboard.dismiss()}
                                    inputStyle={{
                                        color: COLORS.GREY_COLOR,
                                        fontSize: FONT.TextNormal,
                                        fontFamily: FONT_FAMILY.MontserratRegular
                                    }}
                                />
                            </View>
                            <Spacer space={2} />
                            <Text style={{
                                fontFamily: FONT_FAMILY.MontserratSemiBold,
                                color: COLORS.BLACK_COLOR,
                                fontSize: FONT.TextNormal
                            }}>{STRINGS.CONSULT_OTHER_DOCTOR}</Text>
                            <Spacer space={2} />
                            <Text style={{
                                fontFamily: FONT_FAMILY.MontserratSemiBold,
                                color: COLORS.BLACK_COLOR,
                                fontSize: FONT.TextNormal,
                                width: wp(80),
                            }}>{STRINGS.SELECT_DOCTOR_TEXT}</Text>
                            <Spacer space={2} />
                            {/* <DropDownPicker
                        items={doctorList}
                        defaultValue={this.state.selectedDoctor}
                        placeholder="Select"
                        containerStyle={{ width: wp("76%") }}
                        style={{
                            backgroundColor: COLORS.TRANSPARENT,
                            paddingLeft: 0,
                            paddingRight: wp("1%"),
                            paddingBottom: wp("3.5%"),
                            paddingTop: wp("3.5%"),
                            borderWidth: 0,
                            borderBottomColor: "#DDE7E6",
                            borderBottomWidth: 2
                        }}
                        dropDownStyle={{
                            backgroundColor: 'white', zIndex: 10
                        }}
                        itemStyle={{
                            justifyContent: 'flex-start',
                        }}
                        labelStyle={{
                            color: COLORS.GREY_COLOR,
                            fontSize: FONT.TextNormal,
                            fontFamily: FONT_FAMILY.MontserratRegular,
                            width: wp(50)
                        }}
                        placeholderStyle={{ color: COLORS.GREY_COLOR }}
                        dropDownStyle={{ backgroundColor: COLORS.WHITE_COLOR }}
                        onChangeItem={item => {
                            this.setState({
                                selectedDoctor: item.value,
                                selectedDoctorId: item.id,
                                selected: true
                            })
                            console.log(item)
                            console.log(this.state.selectedDoctor)
                        }}
                        selectedLabelStyle={{
                            color: COLORS.LIGHT_BLACK_COLOR,
                            fontSize: FONT.TextNormal,
                            fontFamily: FONT_FAMILY.MontserratRegular
                        }}
                        showArrow={false}
                        activeLabelStyle={{ color: COLORS.APP_THEME_COLOR }}
                        customArrowUp={() => <Image source={AUTH_IMAGES.DROP_DOWN_ICON} resizeMode={'contain'} />}
                        customArrowDown={() => <Image source={AUTH_IMAGES.DROP_DOWN_ICON} resizeMode={'contain'} />}
                    /> */}

                            <Dropdown
                                label='Select'
                                data={doctorList}
                                containerStyle={{ width: wp("80%") }}
                                onChangeText={(value, index, data) => {
                                    this.setState({
                                        selectedDoctor: data[index].value,
                                        selectedDoctorId: data[index].id,
                                    })
                                    console.log(this.state.selectedDoctor, this.state.selectedDoctorId)
                                }
                                }
                                selectedItemColor={COLORS.LIGHT_BLACK_COLOR}
                            />
                            <Spacer space={7} />
                            <View style={{ flexDirection: "row", width: wp(80), justifyContent: "space-evenly" }}>
                                <NewPrimaryButton
                                    btnText={STRINGS.SUBMIT_CANCELLATION}
                                    color={COLORS.ACTIVE_TOGGLE_COLOR}
                                    width={38}
                                    onPress={() => this.onSubmitPress()}
                                    textSize={FONT.TextSmall}
                                    verticalPaddingWithText={3}
                                    borderRadius={wp(6)}
                                />
                                <NewPrimaryButton
                                    btnText={STRINGS.CLOSE}
                                    color={COLORS.REJECT_REQUEST_COLOR}
                                    width={38}
                                    onPress={() => this.onClosePress()}
                                    textSize={FONT.TextSmall}
                                    verticalPaddingWithText={3}
                                    borderRadius={wp(6)}
                                />
                            </View>
                            <Spacer space={5} />
                            <Text style={{
                                fontFamily: FONT_FAMILY.PoppinsRegular,
                                color: COLORS.LIGHT_BLACK_COLOR,
                                fontSize: FONT.TextSmallX,
                                textAlign: "center",
                                width: wp(80),
                            }}>{STRINGS.FORWARD_CONSULTATION_TEXT}</Text>
                            <Spacer space={2} />
                        </View>
                    </View>
                 </TouchableWithoutFeedback>
            //  </KeyboardAvoidingView>
        )
    }
}

const mapStateToProps = state => ({
    getAllDoctorState: state.GetAllDoctorReducer,
});

const mapDispatchToProps = (dispatch) => {
    return {
        getAllDoctorApi: (payload) => dispatch(GetAllDoctorListAction(payload)),
    };
};
const styles = StyleSheet.create({
    iOSddStyle: {
        width: 150,
    },
    ddStyle: {
        width: 150,
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(CancelRequestModal);
