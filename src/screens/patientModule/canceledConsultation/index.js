import BaseClass from "../../../utils/BaseClass";
import { MainContainer, SafeAreaViewContainer } from "../../../utils/BaseStyles";
import COLORS from "../../../themes/Colors";
import React from "react";
import { Header, SearchBar } from "react-native-elements";
import { FlatList, Image, View, TouchableOpacity } from "react-native";
import { DRAWER_ICONS, PATIENT_HOME_SCREEN_IMAGES } from "../../../utils/ImagePaths";
import { Spacer } from "../../../components/spacer";
import { FONT_FAMILY } from "../../../themes/FontFamilies";
import { FONT } from "../../../themes/FontSizes";
import STRINGS from "../../../utils/Strings";
import { ListIcon, ListItemContainer, NameText } from "../commonStyles";
import {
    AgeText,
    CenterContainer,
    CancelConsultationText,
    RightContainer,
    DateTimeText
} from "./styles";
import { connect } from "react-redux";
import { GetLabsAction } from "../../../redux/actions/GetLabsAction";
import AsyncStorage from "@react-native-community/async-storage";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import AntDesign from "react-native-vector-icons/AntDesign";

import OrientationLoadingOverlay from "../../../utils/CustomLoader";
import NoDataFoundComponent from "../../../components/noDataFoundComponent";

const DummyData = [
    {
        name: "David Paul",
        age: "23",
        date: "May 21, 2020",
        time: "10:00 AM",
        charges: "Rs $250",
    },
    {
        name: "Jhon Sons",
        age: "34",
        date: "May 21, 2020",
        time: "10:00 AM",
        charges: "Rs $250",
    }
];

class CanceledConsultation extends BaseClass {

    constructor(props) {
        super(props)
        this.state = {
            accessToken: '',
            search: '',
            caanceledList: [],
            isLoading: false
        };
    }

    componentDidMount() {
        const { search } = this.state;
        AsyncStorage.getItem(STRINGS.LOGIN_DATA).then((result) => {
            let userData = JSON.parse(result);
            // if (userData !== undefined && userData !== null) {
            //     this.setState({accessToken: userData.token});
            //     if (this.isConnected()) {
            //         this.showDialog();
            //         this.props.GetHistoryApi({
            //             searchText: search,
            //             token: userData.token
            //         })
            //     } else {
            //         this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
            //     }
            // }
        });
    }

    componentWillReceiveProps(nextProps, nextContext) {
        
    }

    _renderCustomLoader = () => {
        const { isLoading } = this.state;
        return (
            <OrientationLoadingOverlay visible={isLoading} message="Loading.." />
        )
    };

    _renderItem = (item, index) => {
        return (
            <ListItemContainer>
                <ListIcon source={PATIENT_HOME_SCREEN_IMAGES.LIST_DOCTOR_ICON} />
                <Spacer row={2} />
                <CenterContainer>
                    <NameText>{item.name}</NameText>
                    <Spacer space={2} />
                    <AgeText>{item.age}</AgeText>
                    <Spacer space={2} />
                    <DateTimeText>{(item.date + '  ' + item.time)}</DateTimeText>
                    <Spacer space={2} />
                </CenterContainer>
                <Spacer row={2} />
                <RightContainer>
                    <AgeText>{item.charges}</AgeText>
                </RightContainer>
            </ListItemContainer>
        )
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
                leftComponent={(
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Image
                            source={DRAWER_ICONS.DRAWER_ICON}
                        />
                    </TouchableOpacity>
                )}
                centerComponent={{
                    text: STRINGS.CANCELED_CONSULTATION_TITLE_TEXT, style: {
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

    _renderSearchBar() {
        const { search } = this.state;
        return (
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: wp(95),
                flexDirection: 'row',
                paddingVertical: wp(1),
                marginVertical: wp(2)
            }}>
                <SearchBar
                    placeholderTextColor={COLORS.PLACEHOLDER_COLOR}
                    placeholder={'search..'}
                    onChangeText={this.updateSearch}
                    value={search}
                    containerStyle={{
                        backgroundColor: COLORS.TRANSPARENT,
                        borderWidth: 0,
                        borderTopWidth: 0,
                        borderBottomWidth: 0,
                        alignSelf: 'center'
                    }}
                    inputContainerStyle={{
                        paddingVertical: 5,
                        borderRadius: wp(6),
                        height: wp(12),
                        backgroundColor: COLORS.LIGHT_BLUE_BACKGROUND_COLOR,
                        width: wp("80%"),
                        borderColor: COLORS.WHITE_COLOR,
                        borderWidth: wp(0.1)
                    }}
                    searchIcon={false}
                />
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

    updateSearch = (searchValue) => {
        this.setState({ search: searchValue });
        const { accessToken } = this.state;
        // if (this.isConnected()) {
        //     this.props.GetHistoryApi({
        //         searchText: searchValue,
        //         token: accessToken
        //     })
        // } else {
        //     this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
        // }
    };

    render() {
        const { caanceledList } = this.state;
        return (
            <SafeAreaViewContainer>
                {this._renderHeader()}
                {this._renderSearchBar()}
                <Spacer space={1} />
                <CancelConsultationText>{STRINGS.CANCELED_CONSULTATION_TEXT}</CancelConsultationText>
                <Spacer space={1} />
                <MainContainer style={{ backgroundColor: COLORS.WHITE_COLOR }}>
                    <Spacer space={2} />
                    {/* {(caanceledList.length !== 0)
                        ? */}
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={DummyData}
                        renderItem={({ item, index }) => this._renderItem(item, index)}
                    />
                    {/* :
                        <NoDataFoundComponent title={"No History available!"}/>
                    } */}
                </MainContainer>
                {this._renderCustomLoader()}
            </SafeAreaViewContainer>
        )
    }
};

const mapStateToProps = state => ({
    // GetLabsState: state.LabsReducer,
});

// ----------------------------------------

const mapDispatchToProps = (dispatch) => {
    return {
        // GetHistoryApi: (payload) => dispatch(GetLabsAction(payload)),
    };
};

// ----------------------------------------

export default connect(mapStateToProps, mapDispatchToProps)(CanceledConsultation);
