import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { Header } from "react-native-elements";
import Icon from "react-native-vector-icons/Entypo";
import { Spacer } from "../../../components/spacer";
import COLORS from "../../../themes/Colors";
import BaseClass from "../../../utils/BaseClass";
import { MainContainer, SafeAreaViewContainer } from "../../../utils/BaseStyles";
import { COMMON_IMAGES, DRAWER_ICONS } from "../../../utils/ImagePaths";
import STRINGS from "../../../utils/Strings";
import {
    CenterContainer, ItemContainer, ItemText,
    ProfileDetailsContainer,
    ProfileImage,
    ScreenNameText,
    UserEmailPhoneText,
    UserNameText
} from "./styles";


export default class MyAccountDoctor extends BaseClass {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            number: "",
            mailId: "",
            userPicture: ''
        }
    }

    componentDidMount = () => {
        const { navigation } = this.props;
        this._unsubscribe = navigation.addListener("focus", () => {
            this.onFocusFunction();
        });
    };
    onFocusFunction = () => {
        AsyncStorage.getItem(STRINGS.LOGIN_DATA).then((result) => {
            let userData = JSON.parse(result);
            if (userData !== undefined && userData !== null) {
                this.setState({
                    name: userData.user_data.name,
                    number: userData.user_data.phone_number,
                    mailId: userData.user_data.email,
                    userPicture: userData.path == "https://afyanetwork.com/storage/images/patient" || userData.path == "https://afyanetwork.com/storage/images/doctor" || userData.path == null ? '' : userData.path
                });
                console.warn(userData.path)
            }
        });
    }

    _renderHeader = () => {
        const { navigation } = this.props;
        return (
            <Header
                backgroundColor={COLORS.WHITE_COLOR}
                barStyle={"dark-content"}
                statusBarProps={{
                    translucent: true,
                    backgroundColor: COLORS.transparent,
                }}
                leftComponent={(
                    <TouchableOpacity activeOpacity={1} delayPressIn={0} style={{ padding: 12 }}
                        onPress={() => navigation.openDrawer()}>
                        <Image
                            source={DRAWER_ICONS.DRAWER_ICON}
                        />
                    </TouchableOpacity>
                )}
                containerStyle={{
                    backgroundColor: COLORS.APP_BACKGROUND_COLOR,
                    borderBottomColor: COLORS.TRANSPARENT,
                    paddingTop: 0,
                    height: 65,
                }}
            />
        )
    };

    _renderMainView = () => {
        const { name, mailId, number, userPicture } = this.state;
        const { navigate } = this.props.navigation;
        return (
            <View>
                <ScreenNameText>{STRINGS.MY_PROFILE_TEXT}</ScreenNameText>
                <Spacer space={2} />
                <ProfileDetailsContainer>
                    <ProfileImage source={userPicture === "" ? COMMON_IMAGES.DUMMY_USER_PROFILE_PIC : { uri: userPicture }} />
                    <Spacer row={2} />
                    <CenterContainer>
                        <UserNameText>{name}</UserNameText>
                        <UserEmailPhoneText>+{number}</UserEmailPhoneText>
                        <UserEmailPhoneText>{mailId}</UserEmailPhoneText>
                    </CenterContainer>
                </ProfileDetailsContainer>
                <Spacer space={6} />
                <TouchableOpacity onPress={() => navigate('doctorProfile')}>
                    <ItemContainer>
                        <ItemText>{"Personal Details"}</ItemText>
                        <Icon
                            name={"chevron-small-right"}
                            size={25}
                            color={COLORS.LIGHT_GREY_COLOR}
                        />
                    </ItemContainer>
                </TouchableOpacity>
                <Spacer space={6} />
                {/* <TouchableOpacity>
                    <ItemContainer>
                        <ItemText>{"Medical Details"}</ItemText>
                        <Icon
                            name={"chevron-small-right"}
                            size={25}
                            color={COLORS.LIGHT_GREY_COLOR}
                        />
                    </ItemContainer>
                </TouchableOpacity>
                <Spacer space={6} /> */}
                {/* <TouchableOpacity onPress={() => this.showToastSucess("")}>
                    <ItemContainer>
                        <ItemText>{STRINGS.PAYMENT_METHODS}</ItemText>
                        <Icon
                            name={"chevron-small-right"}
                            size={25}
                            color={COLORS.LIGHT_GREY_COLOR}
                        />
                    </ItemContainer>
                </TouchableOpacity> 
                <Spacer space={6} />*/}
                <TouchableOpacity onPress={() => navigate('PaymentHistory')}>
                    <ItemContainer>
                        <ItemText>{STRINGS.TRANSACTION_HISTORY}</ItemText>
                        <Icon
                            name={"chevron-small-right"}
                            size={25}
                            color={COLORS.LIGHT_GREY_COLOR}
                        />
                    </ItemContainer>
                </TouchableOpacity>
            </View>
        )
    };

    render() {
        return (
            <SafeAreaViewContainer>
                {this._renderHeader()}
                <MainContainer>
                    {this._renderMainView()}
                </MainContainer>
            </SafeAreaViewContainer>
        )
    }
}
