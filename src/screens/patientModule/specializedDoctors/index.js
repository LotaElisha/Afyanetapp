import React from "react";
import BaseClass from "../../../utils/BaseClass";
import {
    MainContainer,
    SafeAreaViewContainer,
    ScrollContainer,
    ShadowViewContainer
} from "../../../utils/BaseStyles";
import COLORS from "../../../themes/Colors";
import { Spacer } from "../../../components/spacer";
import STRINGS from "../../../utils/Strings";
import { FONT_FAMILY } from "../../../themes/FontFamilies";
import { FONT } from "../../../themes/FontSizes";
import {
    Image,
    KeyboardAvoidingView,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    View,
    FlatList,
    Platform,
    Modal, Keyboard
} from "react-native";
import OrientationLoadingOverlay from "../../../utils/CustomLoader";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { NewPrimaryButton } from "../../../components/buttons/primaryButton";
import {
    HorizontalListIcon, SpecializationText, SpecificationText,
    ListItemRightContainer, ListItemCenterContainer,
    DateTimeText, ChargesText,
    HorizontalItemContainer, styles
} from "./styles";
import { Header, SearchBar } from "react-native-elements";
import { connect } from "react-redux";
import { RatingView } from "../../../components/ratingComponent";
import AntDesign from "react-native-vector-icons/AntDesign";
import { DOCTOR_MODULE_IMAGES, PATIENT_HOME_SCREEN_IMAGES, DRAWER_ICONS } from "../../../utils/ImagePaths";
import { ListItemContainer, ListIcon, NameText } from "../commonStyles";
import { SpecializationAction } from "../../../redux/actions/SpecializedDocAction";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    NoRecordsFoundContainer,
    NoRecordsFoundText
} from "../pharmacys/styles";
import Moment from 'moment';
import {
    SpecializationsData
} from "../../../utils/CommonStaticData";
import * as _ from 'lodash';
import NoDataFoundComponent from "../../../components/noDataFoundComponent";
import ActiveDoctor from '../../doctorModule/activeDoctor'

class SpecializedDoctors extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            accessToken: '',
            search: '',
            sepDoctorList: [],
            sepDoctorListCopy: [],
            specializationList: [],
            isLoading: false,
            isVisible: false,
            isFilterSeleted: false,
            userAddress: ''
        };
    }

    componentDidMount() {
        const { search } = this.state;
        let temp = _.cloneDeep(SpecializationsData);
        temp.pop();
        this.setState({ specializationList: temp });
        AsyncStorage.getItem(STRINGS.LOGIN_DATA).then((result) => {
            let userData = JSON.parse(result);
            if (userData !== undefined && userData !== null) {
                this.setState({
                    accessToken: userData.token,
                    userAddress: userData.user_data.street_name
                });
                if (this.isConnected()) {
                    this.showDialog();
                    this.props.GetSpecializedDocApi({
                        searchText: search,
                        addressTo: userData.user_data.street_name,
                        token: userData.token
                    })
                } else {
                    this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
                }
            }
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        const { navigation } = this.props;
        const { specializedDocResponse } = nextProps.GetSpecializedDocState;
        if (specializedDocResponse !== undefined && specializedDocResponse !== null) {
            if (specializedDocResponse.code === 200 && specializedDocResponse.status === 'success') {

                this.setState({
                    sepDoctorList: _.filter(specializedDocResponse.data, (item) => {
                        if (item.user !== null) {
                            return item
                        }
                    }),
                    sepDoctorListCopy: _.filter(specializedDocResponse.data, (item) => {
                        if (item.user !== null) {
                            return item
                        }
                    })
                })

                this.hideDialog();

                // show modal

                const { sepDoctorList, isFilterSeleted } = this.state;
                if (specializedDocResponse.data.length !== 0 && isFilterSeleted) {
                    if (_.every(_.filter(specializedDocResponse.data, (item) => {
                        if (item.user !== null) {
                            return item
                        }
                    }), { user: { status: "Inactive" } })) {

                    } else {
                        this.setState({
                            isVisible: true,
                            isFilterSeleted: !isFilterSeleted
                        })
                    }
                }

            } else if (specializedDocResponse.status === 401) {
                this.hideDialog();
                this.setState({
                    sepDoctorList: [],
                    sepDoctorListCopy: []
                })
                // this.showToastAlert(specializedDocResponse.message);
            } else {
                this.hideDialog();
                this.setState({ sepDoctorList: [] })
                // this.showToastAlert(specializedDocResponse.message);
            }
            this.hideDialog()
        } else {
            this.hideDialog()
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
                    <TouchableOpacity activeOpacity={1} delayPressIn={0} style={{ padding: 12 }}
                        onPress={() => navigation.openDrawer()}>
                        <Image source={DRAWER_ICONS.DRAWER_ICON} />
                    </TouchableOpacity>
                )}
                centerComponent={{
                    text: STRINGS.SPECIALIZED_DOCTORS_TEXT, style: {
                        color: COLORS.LIGHT_BLACK_COLOR,
                        fontSize: FONT.TextNormalX,
                        fontFamily: FONT_FAMILY.PoppinsSemiBold
                    }
                }}

                containerStyle={{
                    backgroundColor: COLORS.WHITE_COLOR,
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
            <View
                style={{ justifyContent: 'center', flexDirection: 'row', paddingVertical: wp(1), marginVertical: wp(2) }}>
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

    updateSearch = search => {
        const { sepDoctorListCopy } = this.state;
        const newData = sepDoctorListCopy.filter(function (item) {
            const itemData = item.user.name.toUpperCase();
            const searchText = search.toUpperCase();
            return itemData.indexOf(searchText) > -1
        });
        this.setState({
            sepDoctorList: newData,
            search
        });
    };

    onSpecialisedDoctorPress = (item) => {
        const { navigation } = this.props;
        const { navigate } = navigation;
        Keyboard.dismiss();
        navigate("DoctorDetail", { data: item })
    }

    _renderItem = (item, index, consultationType) => {
        return (
            <TouchableOpacity activeOpacity={1} delayPressIn={0} onPress={() => this.onSpecialisedDoctorPress(item)}>
                <ListItemContainer>
                    <ListIcon
                        source={item.type === "Doctor" ? PATIENT_HOME_SCREEN_IMAGES.LIST_DOCTOR_ICON : PATIENT_HOME_SCREEN_IMAGES.LIST_LAB_ICON}
                    />
                    <Spacer row={2} />
                    <ListItemCenterContainer>
                        <NameText>{item.user.name}</NameText>
                        <Spacer space={2} />
                        <SpecificationText>{item.doctor_specialization.specialization}</SpecificationText>
                        <Spacer space={2} />
                        <DateTimeText>{Moment(item.created_at).format('d MMM YY, h:mm:ss a')}</DateTimeText>
                        {
                            consultationType === "Previous" &&
                            <Spacer space={2} />
                        }
                        {
                            (item.doctor_rating_data !== null) &&
                            <RatingView
                                isDisable={true}
                                size={4.5}
                                rateCount={item.avg_rating}
                            />
                        }
                    </ListItemCenterContainer>
                    <Spacer row={2} />
                    <ListItemRightContainer>
                        <ChargesText>$ {item.charges}</ChargesText>
                    </ListItemRightContainer>
                </ListItemContainer>
            </TouchableOpacity>
        )
    };

    _onFilterPress = async (item, index) => {
        const { specializationList } = this.state;
        const a = 1
        let tempArray = []
        let copy = _.cloneDeep(specializationList)

        _.map(copy, (item1, index1) => {
            if (index1 === index) {
                item1.isSelect = true
                tempArray.splice(1, 0, item1)
            } else {
                item1.isSelect = false
                tempArray.push(item1)
            }
        })
        this.setState({
            specializationList: tempArray,
            isFilterSeleted: true
        })
        const { accessToken, userAddress } = this.state;

        if (this.isConnected()) {
            this.showDialog();
            await this.props.GetSpecializedDocApi({
                searchText: item.value,
                addressTo: userAddress,
                token: accessToken
            })
        } else {
            this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
        }
        this.myFlatList.scrollToIndex({ animated: true, index: 0 })
    };

    _renderHorizontalItem = (item, index) => {
        return (
            <>
                <View style={{ flexDirection: 'row', padding: wp(1), margin: wp(1) }}>
                    <TouchableOpacity
                        delayPressIn={0}
                        onPress={() => this._onFilterPress(item, index)}
                        activeOpacity={0.8}
                    >
                        <View style={{
                            alignItems: 'center', justifyContent: 'center'
                            , borderColor: COLORS.APP_THEME_COLOR, borderWidth: 0.5,
                            width: wp(25), height: wp(40), borderRadius: wp(22),
                            flexDirection: 'column', padding: wp(1), margin: wp(1),
                            backgroundColor: item.isSelect ? COLORS.APP_THEME_COLOR : COLORS.TRANSPARENT
                        }}>
                            <View style={{
                                alignItems: 'center', justifyContent: 'center',
                                width: wp(20), height: wp(20), borderRadius: wp(10),
                                borderColor: COLORS.APP_THEME_COLOR, borderWidth: 0.5,
                                padding: wp(1), margin: wp(1),//position:'absolute'
                                backgroundColor: COLORS.WHITE_COLOR
                            }}>
                                <HorizontalListIcon
                                    source={item.image}
                                />

                            </View>
                            <Spacer height={2} />
                            <Text style={{
                                fontSize: FONT.TextSmall,
                                fontFamily: FONT_FAMILY.PoppinsSemiBold,
                                color: item.isSelect ? COLORS.WHITE_COLOR : COLORS.LIGHT_BLACK_COLOR,
                                textAlign: 'center'
                            }}>{item.label}</Text>
                        </View>
                    </TouchableOpacity>
                    <Spacer row={1} />
                </View>
            </>
        )
    };

    _renderCustomLoader = () => {
        const { isLoading } = this.state;
        return (
            <OrientationLoadingOverlay visible={isLoading} message="Loading.." />
        )
    };

    render() {
        Moment.locale('en');
        const { sepDoctorList, specializationList, isVisible } = this.state;
        return (
            <SafeAreaViewContainer>
                <KeyboardAvoidingView
                    style={{ flex: 1, backgroundColor: COLORS.WHITE_COLOR }}
                    behavior={(Platform.OS === 'ios') ? 'padding' : null}>
                    {this._renderHeader()}
                    <ScrollContainer keyboardShouldPersistTaps={"handled"}>
                        <MainContainer style={{ backgroundColor: COLORS.WHITE_COLOR }}>
                            {this._renderSearchBar()}

                            <View style={{
                                justifyContent: 'flex-start',
                                width: wp(95),
                                padding: wp(2),
                            }}>
                                <SpecializationText>{STRINGS.SPECIALIZATION_TEXT}</SpecializationText>
                                <Spacer space={1} />
                                <FlatList
                                    horizontal
                                    keyboardShouldPersistTaps={"handled"}
                                    ref={(list) => this.myFlatList = list}
                                    data={specializationList}
                                    renderItem={({ item, index }) => this._renderHorizontalItem(item, index)}
                                    extraData={this.state}
                                />
                            </View>
                            <Spacer space={1} />
                            {(sepDoctorList.length !== 0)
                                ?
                                <FlatList
                                    style={{ flex: 1 }}
                                    keyboardShouldPersistTaps={"handled"}
                                    scrollEnabled={false}
                                    data={sepDoctorList}
                                    renderItem={({ item, index }) => this._renderItem(item, index, "Previous")}
                                />
                                :
                                <NoDataFoundComponent title={"No specialised doctor found!"} />
                            }
                        </MainContainer>
                        <Modal
                            animationType={"fade"}
                            transparent={false}
                            visible={isVisible}
                            onRequestClose={() => {
                                this.setState({ isVisible: false })
                            }}>

                            <ActiveDoctor
                                data={sepDoctorList}
                                onViewDetails={(details) => this.props.navigation.navigate("DoctorDetail", { data: details })}
                                onStartConsultationPress={(details) => this.props.navigation.navigate("startConsultation", { data: details })}
                                closeModal={() =>
                                    this.setState({ isVisible: !isVisible })
                                }
                            />
                        </Modal>
                        {this._renderCustomLoader()}
                    </ScrollContainer>
                </KeyboardAvoidingView>
            </SafeAreaViewContainer>
        )
    }
}


const mapStateToProps = state => ({
    GetSpecializedDocState: state.SpecializationReducer,
});

// ----------------------------------------

const mapDispatchToProps = (dispatch) => {
    return {
        GetSpecializedDocApi: (payload) => dispatch(SpecializationAction(payload)),
    };
};

// ----------------------------------------

export default connect(mapStateToProps, mapDispatchToProps)(SpecializedDoctors);

