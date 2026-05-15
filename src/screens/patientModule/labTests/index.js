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
import { AttendantNameText, CenterContainer } from "./styles";
import { connect } from "react-redux";
import { GetLabsAction } from "../../../redux/actions/GetLabsAction";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import AntDesign from "react-native-vector-icons/AntDesign";
import {
    NoRecordsFoundContainer,
    NoRecordsFoundText
} from "../pharmacys/styles";

import OrientationLoadingOverlay from "../../../utils/CustomLoader";
import NoDataFoundComponent from "../../../components/noDataFoundComponent";


class Laboratories extends BaseClass {

    constructor(props) {
        super(props)
        this.state = {
            accessToken: '',
            search: '',
            labsList: [],
            isLoading: false,
            id: ''
        };
    }

    componentDidMount() {
        const { navigation } = this.props;
        this._unsubscribe = navigation.addListener('focus', () => {
            this.onFocusFunction();
        });

    }

    onFocusFunction = () => {
        this.setState({
            search: ""
        })
        AsyncStorage.getItem(STRINGS.LOGIN_DATA).then((result) => {
            let userData = JSON.parse(result);
            if (userData !== undefined && userData !== null) {
                this.setState({
                    accessToken: userData.token,
                    search: "",
                    id: userData.user_data.id
                });
                if (this.isConnected()) {
                    this.showDialog();
                    this.props.GetLabsApi({
                        searchText: "",
                        token: userData.token
                    })
                } else {
                    this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
                }
            }
        });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        const { navigation } = this.props;
        const { getLabsResponse } = nextProps.GetLabsState;
        if (getLabsResponse !== undefined && getLabsResponse !== null) {
            if (getLabsResponse.code === 200 && getLabsResponse.status === 'success') {
                this.setState({ labsList: getLabsResponse.data })
                this.hideDialog();
            } else if (getLabsResponse.status === 401) {
                this.hideDialog();
                this.setState({ labsList: [] })
                // this.showToastAlert(getLabsResponse.message);
            } else {
                this.hideDialog();
                this.setState({ labsList: [] })
                // this.showToastAlert(getLabsResponse.message);
            }
            this.hideDialog()
        }
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
        const { accessToken, id } = this.state;
        const request_Id = this.props.route.params === undefined ? 0 : this.props.route.params.request_Id;
        return (
            <TouchableOpacity onPress={() => navigate("LabDetails",
                {
                    id: item.user_id,
                    token: accessToken,
                    prescription_Id: request_Id,
                    user_Id: id
                }
            )}>
                <ListItemContainer>
                    <ListIcon source={PATIENT_HOME_SCREEN_IMAGES.LIST_LAB_ICON} />
                    <Spacer row={2} />
                    <CenterContainer>
                        <NameText>{item.lab_name}</NameText>
                        <Spacer space={2} />
                        <AttendantNameText>{item.user != null ? item.user.name : ''}</AttendantNameText>
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
                    <TouchableOpacity activeOpacity={1} delayPressIn={0} style={{ padding: 12 }}
                        onPress={() => navigation.openDrawer()}>
                        <Image
                            source={DRAWER_ICONS.DRAWER_ICON}
                        />
                    </TouchableOpacity>
                )}
                centerComponent={{
                    text: STRINGS.LABORATORY, style: {
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
        if (this.isConnected()) {
            this.props.GetLabsApi({
                searchText: searchValue,
                token: accessToken
            })
        } else {
            this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
        }
    };

    render() {
        const { labsList } = this.state;
        return (
            <SafeAreaViewContainer>
                {this._renderHeader()}
                {this._renderSearchBar()}
                <MainContainer style={{ backgroundColor: COLORS.WHITE_COLOR }}>
                    <Spacer space={2} />
                    {(labsList.length !== 0)
                        ?
                        <FlatList
                            keyboardShouldPersistTaps={"handled"}
                            showsVerticalScrollIndicator={false}
                            data={labsList}
                            renderItem={({ item, index }) => this._renderItem(item, index)}
                        />
                        :
                        <NoDataFoundComponent title={"No laboratories available!"} />
                    }
                </MainContainer>
                {this._renderCustomLoader()}
            </SafeAreaViewContainer>
        )
    }
};

const mapStateToProps = state => ({
    GetLabsState: state.LabsReducer,
});

// ----------------------------------------

const mapDispatchToProps = (dispatch) => {
    return {
        GetLabsApi: (payload) => dispatch(GetLabsAction(payload)),
    };
};

// ----------------------------------------

export default connect(mapStateToProps, mapDispatchToProps)(Laboratories);
