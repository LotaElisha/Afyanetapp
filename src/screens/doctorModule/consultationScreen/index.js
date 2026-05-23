import React, { Component } from "react";
import { Header } from "react-native-elements";
import {
    Image,
    Animated,
    Linking,
    Platform,
    View,
    Keyboard,
    Text,
    ScrollView,
    ImageBackground,
    StatusBar, Alert,
    TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, TextInput
} from "react-native";
import KeyboardSpacer from 'react-native-keyboard-spacer';

import { SafeAreaViewContainer, ScrollContainer } from "../../../utils/BaseStyles";
import BaseClass from "../../../utils/BaseClass";
import { CONSULTATION_CHAT_IMAGES, DOCTOR_MODULE_IMAGES, PHARMACY_DETAILS_IMAGES } from "../../../utils/ImagePaths";
import { Spacer } from "../../../components/spacer";
import COLORS from "../../../themes/Colors";

import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons'
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import Progress from 'react-native-progress/Circle';

import {
    TitleText,
    RBText,
    Seprator,
    MainContainer,
    VerticalRowView,
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
    TimeText,
    MessageBubbleLeft,
    MessageBubbleRight,
    MessageBubbleTextLeft,
    MessageBubbleTextRight,
    MessageBubbleMediaMessage,
    MessageBubbleReportMessage,
    PrescriptionTitleText,
    PrescriptionText,
    AutoGrowInput,
    InputBox,
    SmallButton,
} from "./styles";
import { IconButton } from "react-native-paper";
import { FONT } from "../../../themes/FontSizes";
import { FONT_FAMILY } from "../../../themes/FontFamilies";
import { NewPrimaryButton } from "../../../components/buttons/primaryButton";
import { OpenOptionPopup, } from "../../../utils/Helper";
import io from 'socket.io-client';
import { GetChatHistoryApi } from "../../../redux/actions/getChatHistoryAction";
import { EndConsultationApi } from '../../../redux/actions/EndConsultationAction';
import * as _ from "lodash";
import STRINGS from "../../../utils/Strings";
import { ChatImageBackground } from "../../common/auth/authComponents";
import { AbsoluteContainer } from "../../common/auth/authComponents/styles";
import { TextAreaContainer } from "../../common/auth/signUp/medicalDetails/styles";
import NoDataFoundComponent from "../../../components/noDataFoundComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ConnectyCube, { data } from "react-native-connectycube";
import { getValueById } from "../../../utils/Helper";
import { BloodGroupOptionsData } from "../../../utils/CommonStaticData";
import OrientationLoadingOverlay from "../../../utils/CustomLoader";
import RBSheet from "react-native-raw-bottom-sheet";
import { useRoute } from '@react-navigation/native';
import { IMAGE_BASE_URL } from '../../../redux/constants'
import { GetActiveConsultationDetailApi } from "../../../redux/actions/DoctorConsultationActions";

const dummyMessages = [
    {
        type: "Text",
        text: "Hello How are you?",
        direction: 'right'
    }]
const HEADER_EXPANDED_HEIGHT = wp(60)
const HEADER_COLLAPSED_HEIGHT = 0


export default class ConsultationScreen extends BaseClass {

    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            token: this.props.route.params.token,
            inputBarText: '',
            consultationDetails: {
                care_taker_data: {
                    profile_image_path: null,
                    blood_group: "B+",
                    name: "",
                    phone_number: ""
                },
                patient_connect_cube_data: {
                    name: "",
                    connect_cube_id: ""
                },
                doctor_connect_cube_data: {
                    name: "",
                    connect_cube_id: ""
                },
                doctor_id: "",
                doctor_user_data: {
                    phone_number: ""
                },
                patient_detail_data: {
                    age: ""
                },
                consulted_for: ""
            },
            consultationRequestId: this.props.route.params.data.id,
            senderId: this.props.route.params.userId,
            receiverId: this.props.route.params.opponentId,
            patientId: this.props.route.params.patientId,
            scrollY: new Animated.Value(0),
            isLoading: false,
            isDoctor: false,
            isAttached: false,
            prescription_id_send: '',
            is_typing: false,
        }
    }

    //fun keyboard stuff- we use these to get the end of the ScrollView to "follow" the top of the InputBar as the keyboard rises and falls
    UNSAFE_componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this));
    }

    componentWillUnmount() {
        try {
            this.keyboardDidShowListener.remove();
            this.keyboardDidHideListener.remove();
            this.socket.disconnect()
        }
        catch (e) {
            console.log('keyboard error', e)
        }
    }

    //
    // //When the keyboard appears, this gets the ScrollView to move the end back "up" so the last message is visible with the keyboard up
    // //Without this, whatever message is the keyboard's height from the bottom will look like the last message.
    keyboardDidShow(e) {
        this.scrollView.scrollToEnd();
    }

    //When the keyboard dissapears, this gets the ScrollView to move the last message back down.
    keyboardDidHide(e) {
        this.scrollView.scrollToEnd();
    }

    //
    // //scroll to bottom when first showing the view
    componentDidMount() {
        const { senderId, consultationRequestId, token, isDoctor, receiverId } = this.state;
        const { navigation } = this.props;
        //  http://52.14.207.105:9040
        this.socket = io('https://afyanetwork.com:9040', {
            query: { user_id: senderId },
            transports: ['websocket'],
            jsonp: false,
        });

        this.socket.connect();

        // this.socket.on('connect', socket => {
        //     console.warn("testConnection")
        // });

        this.socket.on('Server_Typing', socket => {
            // console.warn("typing...", socket)
            this.setState({
                is_typing: socket.isTyping
            })
        });

        this.socket.on('Server_Message', msg => {
            //console.warn("msg", msg)

            if (msg.request_id == consultationRequestId) {
                let newMessage = {
                    "sender_id": msg.sender_id,
                    "receiver_id": msg.receiver_id,
                    "request_id": consultationRequestId.toString(),
                    "message": msg.message,
                    "chat_type": "Private",
                    "type": msg.type.toString(),
                    "file_path": msg.file_path,
                    "date": new Date().toString().substr(4, 11),
                    "time": new Date().toString().substr(16, 9),
                    "created_at": null,
                    "updated_at": null,
                    "deleted_at": null,
                    "prescription_id": msg.prescription_id
                }
                this.setState({
                    messages: [...this.state.messages, newMessage]
                })
            }
            else {
            }
        });

        this.showDialog();
        this.getEntireChat();

        AsyncStorage.getItem(STRINGS.LOGIN_DATA).then((result) => {
            let userData = JSON.parse(result);
            if (userData !== undefined && userData !== null) {
                console.log('userDetail Data', userData)
                this.setState({ isDoctor: (userData.user_data.user_type === "doctor") ? true : false })
                ConnectyCube.chat.connect({
                    userId: userData.connect_cube_details.connect_cube_id,
                    password: userData.connect_cube_details.password,
                })
                    .then(() => {

                    })
                    .catch(() => {

                    });
                GetActiveConsultationDetailApi({
                    "token": token,
                    "request_id": consultationRequestId,
                    "caretaker_id": senderId,
                    'doctor_id': senderId,
                    "is_doctor": userData.user_data.user_type === "doctor" ? true : false
                }, response => this.handleConsultationDetailResponse(response));
            }
        }).catch((error) => {
            console.log(error)
        })
            .done();

    }
    handleConsultationDetailResponse = (response) => {
        this.hideDialog()
        debugger
        if (response !== undefined && response !== null) {
            if (response.code === 200) {
                this.hideDialog()
                if (response.data !== undefined && response.data !== null) {
                    console.warn(response.data)
                    setTimeout(() => {
                        this.setState({
                            consultationDetails: response.data[0]
                        })
                    }, 300)
                } else {

                }
            } else if (response.code === 204) {
                this.hideDialog()
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

    //this is a bit sloppy: this is to make sure it scrolls to the bottom when a message is added, but
    //the component could update for other reasons, for which we wouldn't want it to scroll to the bottom.
    componentDidUpdate(nextProps) {
        const { route } = this.props;
        const { isAttached, prescription_id_send } = this.state;
        setTimeout(function () {
            this.scrollView.scrollToEnd({ animated: true });
        }.bind(this))
        if (route.params !== undefined && isAttached && prescription_id_send !== route.params.id) {
            if (route.params.comingFrom === "Uploads") {
                this.setState({
                    isAttached: false,
                    prescription_id_send: route.params.id
                })
                this._sendMessage(route.params.type, route.params.id)
                console.warn('send message called')
            }
        }

    }
    UNSAFE_componentWillReceiveProps(nextProps) {

    }

    _onChangeInputBarText(text) {
        this.setState({
            inputBarText: text
        });
    }

    _onInputSizeChange() {
        setTimeout(function () {
            this.scrollView.scrollToEnd({ animated: true });
        }.bind(this))
    }

    getEntireChat = () => {
        const { token, senderId, receiverId, consultationRequestId } = this.state;
        GetChatHistoryApi({
            token: token,
            sender_id: senderId,
            receiver_id: receiverId,
            request_id: consultationRequestId
        }, response => this.handleGetEntireChatResponse(response))
    }

    handleGetEntireChatResponse = (response) => {
        this.hideDialog()
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

    async _sendMessage(messageType, data) {
        const { senderId, receiverId, consultationRequestId } = this.state;
        console.warn("test", messageType, data)
        //end typing
        // this.socket.emit("Client_Typing",{isTyping: false })
        let newMessage
        if (messageType === 1) {
            newMessage = {
                "sender_id": senderId,
                "receiver_id": receiverId,
                "request_id": consultationRequestId.toString(),
                "message": this.state.inputBarText,
                "chat_type": "Private",
                "type": "1",
                "is_local_image": false,
                "file_path": "",
                "date": new Date().toString().substr(4, 11),
                "time": new Date().toString().substr(16, 9),
                "created_at": null,
                "updated_at": null,
                "deleted_at": null,
                'prescription_id': null
            }
        } else if (messageType === 3 || messageType === 4) {
            console.warn('test prescription send')
            newMessage = {
                "sender_id": senderId,
                "receiver_id": receiverId,
                "request_id": consultationRequestId.toString(),
                "message": '',
                "chat_type": "Private",
                "type": messageType.toString(),
                "is_local_image": false,
                "file_path": "",
                "date": new Date().toString().substr(4, 11),
                "time": new Date().toString().substr(16, 9),
                "created_at": null,
                "updated_at": null,
                "deleted_at": null,
                'prescription_id': data
            }
        } else {
            console.warn("image", data.path)
            newMessage = {
                "sender_id": senderId,
                "receiver_id": receiverId,
                "request_id": consultationRequestId.toString(),
                "message": "",
                "chat_type": "Private",
                "type": "2",
                "is_local_image": true,
                "file_path": data.path,
                "date": new Date().toString().substr(4, 11),
                "time": new Date().toString().substr(16, 9),
                "created_at": null,
                "updated_at": null,
                "deleted_at": null,
                'prescription_id': null
            }
        }
        this.setState({
            messages: [...this.state.messages, newMessage]
        })

        let fileName;
        if (messageType === 2 && Platform.OS === "android") {
            fileName = data.path.slice(data.path.lastIndexOf('/') + 1)
        }
        let messageData = {
            message: messageType === 1 ? this.state.inputBarText : "",
            sender_id: senderId,
            receiver_id: receiverId,
            request_id: consultationRequestId,
            date: new Date().toString().substr(4, 11),
            time: new Date().toString().substr(16, 9),
            chat_type: "Private",
            prescription_id: messageType === 3 || messageType === 4 ? data : null,
            type: messageType,
            base64_file: messageType === 2 ? data.data : null,
            file_name: messageType === 2 ? Platform.OS === "android" ? fileName.slice(0, fileName.lastIndexOf('.')) : data.filename.slice(0, data.filename.lastIndexOf('.')) : null,
            file_extension: messageType === 2 ? Platform.OS === "android" ? fileName.slice(fileName.lastIndexOf('.') + 1) : data.filename.slice(data.filename.lastIndexOf('.') + 1) : null,
        }
        console.warn('sen me', messageData)
        this.socket.emit('Client_Message', {
            message: messageType === 1 ? this.state.inputBarText : "",
            sender_id: senderId,
            receiver_id: receiverId,
            request_id: consultationRequestId,
            date: new Date().toString().substr(4, 11),
            time: new Date().toString().substr(16, 9),
            chat_type: "Private",
            prescription_id: messageType === 3 || messageType === 4 ? data : null,
            type: messageType,
            base64_file: messageType === 2 ? data.data : null,
            file_name: messageType === 2 ? Platform.OS === "android" ? fileName.slice(0, fileName.lastIndexOf('.')) : data.filename.slice(0, data.filename.lastIndexOf('.')) : null,
            file_extension: messageType === 2 ? Platform.OS === "android" ? fileName.slice(fileName.lastIndexOf('.') + 1) : data.filename.slice(data.filename.lastIndexOf('.') + 1) : null,
            user_data: JSON.stringify({ patient_id: this.state.patientId,id:this.state.consultationRequestId })
        });
        Keyboard.dismiss()

        await this.setState({
            inputBarText: ''
        });

        // this.getEntireChat();
    }


    _renderHeader = () => {
        const { navigation } = this.props;
        const { consultationRequestId, token, isDoctor } = this.state;
        return (
            <Header
                backgroundColor={COLORS.LIGHT_BLACK_COLOR}
                statusBarProps={{
                    translucent: true,
                }}
                leftComponent={(
                    <AntDesign
                        name={"left"}
                        color={COLORS.LIGHT_BLACK_COLOR}
                        size={20}
                        onPress={() => navigation.pop()}
                    />
                )}
                centerComponent={(
                    <TitleText>
                        Consultation
                    </TitleText>
                )}

                rightComponent={(
                    isDoctor ?
                        <NewPrimaryButton
                            btnText={'End'}
                            color={COLORS.REJECT_REQUEST_COLOR}
                            width={18}
                            onPress={() => this.EndButtonPress()}
                            textSize={FONT.TextSmallX}
                            isTextBold={true}
                            borderRadius={wp("4%")}
                            verticalPaddingWithText={.5}
                        />
                        :
                        <View />
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
    EndButtonPress = () => {
        const { token, consultationRequestId } = this.state;
        Alert.alert(
            STRINGS.APP_NAME,
            STRINGS.END_CONSULTATION_ALERT,
            [
                {
                    text: STRINGS.NO_TEXT, style: 'cancel'
                },
                {
                    text: STRINGS.YES_TEXT, onPress: () => {
                        //end consultation   
                        if (this.isConnected()) {
                            this.showDialog()
                            EndConsultationApi({
                                "token": token,
                                "request_id": consultationRequestId
                            }, response => this.handleConsultationResponse(response));
                        }
                        else {
                            this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
                        }
                    }
                },

            ],
            { cancelable: false });
    };

    _renderCustomLoader = () => {
        const { isLoading } = this.state;
        return (
            <OrientationLoadingOverlay visible={isLoading} message="Loading.." />
        )
    };
    ///=======bottom sheet clicks
    optionsEvent(type) {
        const { navigation } = this.props;
        const { navigate } = navigation;
        const { consultationRequestId, receiverId, senderId, patientId, consultationDetails } = this.state;
        // this.Standard.close();
        switch (type) {
            case 'Test':
                this.setState({
                    isAttached: true
                })
                navigate('TestPrescription',
                    {
                        request_Id: consultationRequestId,
                        doctor_Id: senderId,
                        opponent_Id: receiverId,
                        patient_id: patientId,
                        data: consultationDetails
                    })
                break;
            case 'Medicine':
                this.setState({
                    isAttached: true
                })
                navigate('MedicalPrescription',
                    {
                        request_Id: consultationRequestId,
                        doctor_Id: senderId,
                        opponent_Id: receiverId,
                        patient_id: patientId,
                        data: consultationDetails
                    })
                break;
            case 'Gallery':
                OpenOptionPopup(image => {
                    this.Standard.close();
                    if (image !== "")
                        this._sendMessage(2, image)
                })
                break;
            default:
                this.Standard.close();
                break;
        }
    }

    render() {
        const { consultationDetails, consultationRequestId, receiverId, senderId, isDoctor, } = this.state;
        const { navigation } = this.props;
        const { navigate } = navigation;
        let patient_image = consultationDetails.care_taker_data.profile_image_path != null ? consultationDetails.care_taker_data.profile_image_path : ''
        return (
            <SafeAreaViewContainer>
                {this._renderHeader()}
                <KeyboardAvoidingView
                    style={{ flex: 1, backgroundColor: COLORS.APP_BACKGROUND_COLOR }}
                    behavior={(Platform.OS === 'ios') ? 'padding' : null}>
                    <View style={{ flex: 1 }}>
                        <ScrollContainer
                            ref={(ref) => {
                                this.scrollView = ref;
                            }}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps={"handled"}
                            bounces={false}>
                            <MainContainer>
                                <ChatImageBackground />
                                <AbsoluteContainer>
                                    <Spacer space={20} />
                                    <View style={{
                                        backgroundColor: COLORS.WHITE_COLOR,
                                        borderTopLeftRadius: wp(9),
                                        borderTopRightRadius: wp(9),
                                    }}>
                                        <Spacer space={1.5} />
                                        {consultationDetails.doctor_id === senderId ?
                                            <VerticalRowView>
                                                <RoundImageContainer >
                                                    <Image
                                                        style={{ resizeMode: 'cover', height: wp(20), width: wp(20), borderRadius: wp(10) }}
                                                        source={patient_image !== "" ? { uri: patient_image } : DOCTOR_MODULE_IMAGES.DUMMY_DOCTOR_PICTURE} />
                                                </RoundImageContainer>
                                                <HorizontalRowView style={{ justifyContent: 'flex-start' }}>
                                                    <NameText
                                                        style={{ textAlign: 'left' }}>{consultationDetails.care_taker_data.name}</NameText>
                                                    <BlueText>Blood
                                                        Group: {getValueById(BloodGroupOptionsData, consultationDetails.care_taker_data.blood_group)}</BlueText>
                                                    <GreyText>Age: {consultationDetails.patient_detail_data.age} Years</GreyText>
                                                </HorizontalRowView>
                                            </VerticalRowView>
                                            :
                                            <></>
                                        }

                                        <Spacer space={1.5} />
                                        <VerticalRowView style={{ alignItems: "center", }}>
                                            <Spacer row={2} />
                                            <GreyBoldText style={{ width: wp(64) }}>Consulting
                                                For- {consultationDetails.consulted_for}</GreyBoldText>
                                            <Spacer row={.5} />
                                            <TouchableOpacity onPress={() => {
                                                let phoneNumber = '';
                                                if (consultationDetails.doctor_id === senderId) {
                                                    if (Platform.OS === 'android') {
                                                        phoneNumber = `tel:+${Number(consultationDetails.care_taker_data.phone_number)}`;
                                                    } else {
                                                        phoneNumber = `telprompt:+${Number(consultationDetails.care_taker_data.phone_number)}`;
                                                    }
                                                } else {
                                                    if (Platform.OS === 'android') {
                                                        phoneNumber = `tel:+${Number(consultationDetails.doctor_user_data.phone_number)}`;
                                                    } else {
                                                        phoneNumber = `telprompt:+${Number(consultationDetails.doctor_user_data.phone_number)}`;
                                                    }
                                                }
                                                Linking.openURL(phoneNumber);
                                            }}>
                                                <Image style={{ height: wp(13), width: wp(13) }}
                                                    source={CONSULTATION_CHAT_IMAGES.AUDIO_CALL_ICON} />
                                            </TouchableOpacity>
                                            <Spacer row={2} />
                                            <TouchableOpacity onPress={() => {
                                                if (consultationDetails.doctor_id === senderId) {
                                                    navigate("VideoScreen",
                                                        {
                                                            opponentsIds: [consultationDetails.patient_connect_cube_data.connect_cube_id],
                                                            sender_id: senderId,
                                                            receiver_id: receiverId
                                                        }
                                                    )
                                                } else {
                                                    navigate("VideoScreen",
                                                        {
                                                            opponentsIds: [consultationDetails.doctor_connect_cube_data.connect_cube_id],
                                                            sender_id: senderId,
                                                            receiver_id: receiverId
                                                        }
                                                    )
                                                }

                                            }}>
                                                <Image style={{ height: wp(13), width: wp(13) }}
                                                    source={CONSULTATION_CHAT_IMAGES.VIDEO_CALL_ICON} />
                                            </TouchableOpacity>
                                            <Spacer row={2} />
                                        </VerticalRowView>
                                        <Spacer space={1} />
                                        <View style={{
                                            width: wp(100),
                                            backgroundColor: COLORS.GREY_BORDER_COLOR,
                                            height: .8
                                        }} />
                                        {
                                            this.renderChatContainer()
                                        }

                                    </View>
                                </AbsoluteContainer>
                            </MainContainer>
                        </ScrollContainer>
                        <InputBar
                            onSelectMedia={() => {
                                if (isDoctor)
                                    this.Standard.open()
                                else
                                    OpenOptionPopup(image => {
                                        if (image !== "")
                                            this._sendMessage(2, image)
                                    });
                            }}
                            onSendPressed={() => {
                                if (this.state.inputBarText.trim().length === 0) {

                                } else {
                                    this._sendMessage(1, "")
                                }
                            }}
                            onFocus={() => {
                                this.socket.emit("Client_Typing", {
                                    isTyping: true,
                                    receiver_id: this.state.receiverId
                                })
                            }}
                            onBlur={() => {
                                this.socket.emit("Client_Typing", {
                                    isTyping: false,
                                    receiver_id: this.state.receiverId
                                })
                            }}
                            onSizeChange={() => this._onInputSizeChange()}
                            onChangeText={(text) => this._onChangeInputBarText(text)}
                            text={this.state.inputBarText}
                        />
                    </View>
                    {this._renderCustomLoader()}
                    {
                        <RBSheet
                            ref={ref => {
                                this.Standard = ref;
                            }}
                            height={wp(50)}
                        >
                            <View style={{
                                width: wp("100%"),
                                paddingVertical: wp("3.5%"),
                                paddingHorizontal: wp("2%"),
                                alignItems: 'center',
                                backgroundColor: COLORS.WHITE_COLOR_SHADE,
                                marginBottom: wp("4%"),
                                borderRadius: wp("3%"),
                            }}>
                                <RBText onPress={() => {
                                    this.Standard.close();
                                    this.optionsEvent('Medicine')
                                }}>{STRINGS.RB_MEDICAL_PRESCRIPTION_TEXT}</RBText>
                                <Seprator />
                                <RBText onPress={() => {
                                    this.Standard.close();
                                    this.optionsEvent('Test')
                                }} >{STRINGS.RB_TEST_PRESCRIPTION_TEXT}</RBText>
                                <Seprator />
                                <RBText onPress={() => {
                                    // this.Standard.close();
                                    this.optionsEvent('Gallery')
                                }} >{STRINGS.RB_CAMERA_GALLERY_TEXT}</RBText>
                                <Seprator />
                                <Text onPress={() => this.Standard.close()} style={{
                                    color: COLORS.REJECT_REQUEST_COLOR,
                                    fontSize: FONT.TextNormalX,
                                    fontFamily: FONT_FAMILY.PoppinsRegular,
                                    marginVertical: 6
                                }}>{STRINGS.CANCEL}</Text>
                            </View>
                        </RBSheet>
                    }
                </KeyboardAvoidingView>
            </SafeAreaViewContainer >
        )
    }

    renderChatContainer() {
        const { navigation } = this.props;
        const { token, senderId, receiverId, consultationRequestId, isDoctor, consultationDetails } = this.state;
        return (
            <ChatContainer scrollEnabled={false}>
                {
                    this.state.messages.map((message) =>
                        <MessageBubble
                            isDoctor={isDoctor}
                            token={token}
                            direction={message.sender_id === senderId ? "right" : "left"}
                            message={message}
                            navigation={navigation}
                        />


                    )
                }
                <Spacer space={2} />
                { this.state.is_typing &&
                    <Text style={{
                        width: wp(90),
                        padding: wp(2),
                        color: COLORS.PLACEHOLDERS_COLOR,
                        fontSize: FONT.TextSmallX,
                        fontFamily: FONT_FAMILY.PoppinsRegular
                    }}>{isDoctor ? consultationDetails.patient_connect_cube_data.name : consultationDetails.doctor_connect_cube_data.name} is Typing...</Text>}

            </ChatContainer>
        )
    }

    handleConsultationResponse = (response) => {
        const { navigation } = this.props;
        const { navigate } = navigation;
        this.hideDialog()
        if (response !== undefined && response !== null) {
            if (response.code === 200) {
                console.log(response.data)
                this.hideDialog()
                if (response.data !== undefined && response.data !== null && response.data.length !== 0) {
                    this.showToastSucess(response.message)
                    navigate('DoctorHomeScreen')
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
}


class MessageBubble
    extends Component {
    OnPrescriptionPress(type, id) {
        const { navigation } = this.props;
        const { navigate } = navigation;
        switch (type) {
            case '3':
                navigate('Pharmacy',
                    {
                        request_Id: id,
                    })
                break;
            case '4':
                navigate('Labs',
                    {
                        request_Id: id,
                    })
                break;
        }
    }
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

                            : this.props.message.type === "2" ?
                                <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Preview', { url: this.props.message.file_path })}>
                                    <MessageBubbleMediaMessage
                                        indicator={Progress}
                                        source={{ uri: this.props.message.file_path }} />
                                </TouchableWithoutFeedback>
                                :
                                <MessageBubbleReportMessage style={{ flexDirection: 'row' }}>
                                    <View style={{ padding: wp(0.5) }} >
                                        <PrescriptionTitleText style={{ color: COLORS.WHITE_COLOR }} >{this.props.message.type === "4" ? 'Labs Test' : 'Medical Prescription'} </PrescriptionTitleText>
                                        <Spacer space={1.5} />
                                        {this.props.isDoctor ?
                                            <PrescriptionText >{this.props.message.type === "4" ? 'View Labs' : 'View Pharmacies'} </PrescriptionText>
                                            :
                                            <PrescriptionText style={{ textDecorationLine: 'underline', color: COLORS.WHITE_COLOR }}
                                                onPress={() => this.OnPrescriptionPress(this.props.message.type, this.props.message.prescription_id)} >{this.props.message.type === "4" ? 'View Labs' : 'View Pharmacies'} </PrescriptionText>
                                        }
                                    </View>
                                    <AntDesign
                                        name={"filetext1"}
                                        color={COLORS.WHITE_COLOR}
                                        size={wp(12)}
                                        onPress={() => this.ViewPrescription(this.props.message.type, this.props.message.prescription_id)} />
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
                            : this.props.message.type === "2" ?
                                <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Preview', { url: this.props.message.file_path })}>
                                    <MessageBubbleMediaMessage
                                        indicator={Progress}
                                        source={{ uri: this.props.message.file_path }} />
                                </TouchableWithoutFeedback>
                                :
                                <MessageBubbleReportMessage style={{ flexDirection: 'row' }}>
                                    <View style={{ padding: wp(0.5) }} >
                                        <PrescriptionTitleText >{this.props.message.type === "4" ? 'Labs Test' : 'Medical Prescription'} </PrescriptionTitleText>
                                        <Spacer space={1.5} />
                                        {this.props.isDoctor ?
                                            <PrescriptionText  >{this.props.message.type === "4" ? 'View Labs' : 'View Pharmacies'} </PrescriptionText>
                                            :
                                            <PrescriptionText style={{ textDecorationLine: 'underline' }}
                                                onPress={() => this.OnPrescriptionPress(this.props.message.type, this.props.message.prescription_id)} >{this.props.message.type === "4" ? 'View Labs' : 'View Pharmacies'} </PrescriptionText>
                                        }
                                    </View>
                                    <AntDesign
                                        name={"filetext1"}
                                        color={COLORS.APP_THEME_COLOR}
                                        size={wp(12)}
                                        onPress={() => this.ViewPrescription(this.props.message.type, this.props.message.prescription_id)} />
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

class InputBar extends Component {

    render() {
        const { isDoctor } = this.props
        console.log('total props', this.props)
        return (
            <InputBox>
                <TextInput style={{
                    flex: 1,
                    color: COLORS.BLACK_COLOR,
                    fontSize: FONT.TextNormal,
                    paddingVertical: 2,
                    fontFamily: FONT_FAMILY.MontserratRegular
                }}

                    multiline
                    textAlignVertical={"top"}
                    onFocus={this.props.onFocus}
                    onBlur={this.props.onBlur}
                    placeholder='Type message...'
                    placeholderTextColor={COLORS.PLACEHOLDERS_COLOR}
                    value={this.props.text}
                    autoCapitalize='none'
                    onContentSizeChange={this.props.onSizeChange}
                    onChangeText={(text) => this.props.onChangeText(text)}
                    inputStyle={{
                        color: COLORS.GREY_COLOR,
                        fontSize: FONT.TextNormal,
                        fontFamily: FONT_FAMILY.MontserratRegular
                    }}
                />
                <SmallButton
                    onPress={() => { this.props.onSelectMedia() }}>
                    <SimpleLineIcon name="paper-clip" size={22} style={{ transform: [{ rotateY: '180deg' }] }} />
                </SmallButton>
                <Spacer row={1.5} />
                <SmallButton
                    onPress={() => this.props.onSendPressed()}>
                    <Ionicons name="send-sharp" size={24} color={COLORS.APP_THEME_COLOR} />
                </SmallButton>
            </InputBox>
        );
    }
}
