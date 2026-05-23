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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import AntDesign from "react-native-vector-icons/AntDesign";

import OrientationLoadingOverlay from "../../../../../utils/CustomLoader";
import NoDataFoundComponent from "../../../../../components/noDataFoundComponent";
import { GetLabHistoryApi } from '../../../../../redux/actions/GetHistoryAction'
import Moment from 'moment';
import propTypes from 'prop-types';
let checkVar = false;

class LabHistory extends BaseClass {
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
        if (this.props.routeKey === 1) {
            if (checkVar === true) {
                checkVar = false;
                this.hitApi();
            }
        } else if (this.props.routeKey === 2 || this.props.routeKey === 0) {
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
                    GetLabHistoryApi({
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
        return (
            <TouchableOpacity onPress={() =>
                this.props.navigation.navigate("LabDetails",
                    {
                        id: item.lab_id,
                        token: this.state.accessToken,
                        prescription_Id: item.medical_prescription_id,
                        user_Id: item.caretaker_id
                    })
            }>
                <ListItemContainer>
                    <ListIcon source={PATIENT_HOME_SCREEN_IMAGES.LIST_LAB_ICON} />
                    <Spacer row={2} />
                    <CenterContainer>
                        <NameText>{item.lab_detail_data.lab_name}</NameText>
                        <Spacer space={1} />
                        <AgeText>{item.lab_user_data.name}</AgeText>
                        <Spacer space={1} />
                        <DateTimeText>{Moment(item.created_at).format('d MMM YY, h:mm:ss a')}</DateTimeText>
                        <Spacer space={1} />
                    </CenterContainer>
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
                    text: 'Lab History', style: {
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
            listItem.lab_user_data.name
                .toLowerCase()
                .includes(this.state.search.toLowerCase())
        );
    };

    render() {
        const { historyList } = this.state;
        // console.log("history list is",historyList)

        return (
            <MainContainer style={{ backgroundColor: COLORS.WHITE_COLOR }}>
                {/* <Spacer space={2}/> */}
                {(historyList.length !== 0)
                    ?
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={this.filterList(historyList.lab_requests)}
                        renderItem={({ item, index }) => this._renderItem(item, index)}
                    />
                    :
                    <NoDataFoundComponent title={"No Lab History available!"} />
                }
            </MainContainer>
        )
    }
};

const mapStateToProps = state => ({
});

// ----------------------------------------

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

// ----------------------------------------

export default connect(mapStateToProps, mapDispatchToProps)(LabHistory);
