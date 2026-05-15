import BaseClass from "../../../../../utils/BaseClass";
import { MainContainer, SafeAreaViewContainer } from "../../../../../utils/BaseStyles";
import COLORS from "../../../../../themes/Colors";
import React from "react";
import { Header, SearchBar } from "react-native-elements";
import { FlatList, Image, View, TouchableOpacity } from "react-native";
import { DRAWER_ICONS, PATIENT_HOME_SCREEN_IMAGES } from "../../../../../utils/ImagePaths";
import { Spacer } from "../../../../../components/spacer";
import { FONT_FAMILY } from "../../../../../themes/FontFamilies";
import { FONT } from "../../../../../themes/FontSizes";
import STRINGS from "../../../../../utils/Strings";
import { ListIcon, ListItemContainer, NameText } from "../../../commonStyles";
import {
    AgeText,
    CenterContainer,
    CompletedConsultationText,
    RightContainer,
    DateTimeText
} from "./styles";
import { connect } from "react-redux";
import { GetLabsAction } from "../../../../../redux/actions/GetLabsAction";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import AntDesign from "react-native-vector-icons/AntDesign";


import OrientationLoadingOverlay from "../../../../../utils/CustomLoader";
import NoDataFoundComponent from "../../../../../components/noDataFoundComponent";
import { GetConsultationHistoryApi } from '../../../../../redux/actions/GetHistoryAction'
import Moment from 'moment';
import propTypes from 'prop-types';
let checkVar = false;


class History extends BaseClass {

    constructor(props) {
        super(props)
        this.state = {
            accessToken: '',
            search: '',
            historyList: [],
            isLoading: false
        };
    }

    static propTypes = {
        routeKey: propTypes.number,
    };

    componentDidMount() {
        this.hitApi();
        const { navigation } = this.props;
        this._unsubscribe = navigation.addListener('focus', () => {
            this.hitApi();
        });
    }

    componentDidUpdate(prevProps, preState, snapShot) {
        if (this.props.routeKey === 0) {
            if (checkVar === true) {
                checkVar = false;
                this.hitApi();
            }
        } else if (this.props.routeKey === 1 || this.props.routeKey === 2) {
            checkVar = true;
        }
    }


    componentWillUnmount() {
        this._unsubscribe();
    }

    hitApi() {
        AsyncStorage.getItem(STRINGS.LOGIN_DATA).then((result) => {
            let userData = JSON.parse(result);
            if (userData !== undefined && userData !== null) {
                this.setState({ accessToken: userData.token });
                if (this.isConnected()) {
                    this.showDialog();
                    console.log("userdata is", userData)
                    console.log("token", userData.token)
                    console.log("id", userData.user_data.id)
                    GetConsultationHistoryApi({
                        token: userData.token,
                        id: userData.user_data.id
                    }, (data) => this.historyResult(data))
                } else {
                    this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
                }
            }
        });
    }

    historyResult(response) {
        if (response !== undefined && response !== null) {
            this.hideDialog();
            if (response.code === 200) {
                if (response.data !== undefined) {
                    this.setState({
                        historyList: response.data,
                    });
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

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {

    }

    _renderCustomLoader = () => {
        const { isLoading } = this.state;
        return (
            <OrientationLoadingOverlay visible={isLoading} message="Loading.." />
        )
    };

    _renderItem = (item, index) => {
        const { navigation } = this.props;
        const { navigate } = navigation;
        return (
            <TouchableOpacity onPress={() => {
                console.warn("details", item)
                navigate("HistoryDetails", {
                    data: {
                        id: item.id,
                        userId: item.doctor_id,
                        doctorImage: item.doctor_user_data.profile_image
                    }
                })
            }}>
                <ListItemContainer>
                    <ListIcon source={PATIENT_HOME_SCREEN_IMAGES.LIST_DOCTOR_ICON} />
                    <Spacer row={2} />
                    <CenterContainer>
                        <NameText>{item.doctor_user_data.name}</NameText>
                        <Spacer space={1} />
                        <AgeText>{item.doctor_detail_data.doc_specialization}</AgeText>
                        <Spacer space={1} />
                        <DateTimeText>{Moment(item.created_at).format('d MMM YY, h:mm:ss a')}</DateTimeText>
                        <Spacer space={1} />
                    </CenterContainer>
                    <Spacer row={1} />
                    <RightContainer>
                        <AgeText>{'$' + item.doctor_detail_data.charges}</AgeText>
                    </RightContainer>
                </ListItemContainer>
            </TouchableOpacity>
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
                    text: 'Doctor History', style: {
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
                    placeholderTextColor={COLORS.PLACEHOLDERS_COLOR}
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
    };

    filterList = (historyData) => {
        return historyData.filter((listItem) =>
            listItem.doctor_user_data.name
                .toLowerCase()
                .includes(this.state.search.toLowerCase())
        );
    };

    render() {
        const { historyList } = this.state;
        console.log("history request------", historyList.doctor_requests)
        // console.log("history list is",historyList)

        return (
            <MainContainer style={{ backgroundColor: COLORS.WHITE_COLOR }}>
                {/* <Spacer space={2}/> */}
                {(historyList.length !== 0)
                    ?
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={this.filterList(historyList.doctor_requests)}
                        renderItem={({ item, index }) => this._renderItem(item, index)}
                    />
                    :
                    <NoDataFoundComponent title={"No Doctor History available!"} />
                }
            </MainContainer>
        )
    }
};

const mapStateToProps = state => ({
    GetLabsState: state.LabsReducer,
});

// ----------------------------------------

const mapDispatchToProps = (dispatch) => {
    return {
        GetHistoryApi: (payload) => dispatch(GetLabsAction(payload)),
    };
};

// ----------------------------------------

export default connect(mapStateToProps, mapDispatchToProps)(History);
