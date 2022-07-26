import BaseClass from "../../../utils/BaseClass";
import {MainContainer, SafeAreaViewContainer} from "../../../utils/BaseStyles";
import COLORS from "../../../themes/Colors";
import React from "react";
import {Header, SearchBar} from "react-native-elements";
import {FlatList, Image, View, TouchableOpacity, Modal, Keyboard} from "react-native";
import {DRAWER_ICONS, PATIENT_HOME_SCREEN_IMAGES} from "../../../utils/ImagePaths";
import {Spacer} from "../../../components/spacer";
import {FONT_FAMILY} from "../../../themes/FontFamilies";
import {FONT} from "../../../themes/FontSizes";
import STRINGS from "../../../utils/Strings";
import {ListIcon, ListItemContainer, NameText} from "../commonStyles";
import {RatingView} from "../../../components/ratingComponent";
import {CategoryText, CenterContainer, ChargesText, RightContainer, DateTimeText} from "./styles";
import {connect} from "react-redux";
import {GetGenDoctorAction} from "../../../redux/actions/GetGeneralDoctorAction";
import AsyncStorage from "@react-native-community/async-storage";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import AntDesign from "react-native-vector-icons/AntDesign";
import {
    NoRecordsFoundContainer,
    NoRecordsFoundText
} from "../pharmacys/styles";
import Moment from 'moment';
import OrientationLoadingOverlay from "../../../utils/CustomLoader";
import NoDataFoundComponent from "../../../components/noDataFoundComponent";
import ActiveDoctor from '../../doctorModule/activeDoctor'
import * as _ from "lodash";

class GeneralDoctorsListing extends BaseClass {


    constructor(props) {
        super(props)
        this.state = {
            accessToken: '',
            search: '',
            genDoctorList: [],
            isLoading: false,
            isVisible: false,
            isShowModal: true
        };
    }

    componentDidMount() {
        const {navigation} = this.props;
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
                    isVisible: false,
                    isShowModal: true
                });
                if (this.isConnected()) {
                    this.showDialog();
                    this.props.GetGenDoctorApi({
                        searchText: "",
                        addressTo: userData.user_data.street_name,
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

    componentWillReceiveProps(nextProps, nextContext) {
        debugger
        const {genDoctorResponse} = nextProps.GetGenDoctorState;
        if (genDoctorResponse !== undefined && genDoctorResponse !== null) {
            if (genDoctorResponse.code === 200 && genDoctorResponse.status === 'success') {
                console.warn("gen", genDoctorResponse.data[0].profile_image)
                this.setState({
                    genDoctorList: _.filter(genDoctorResponse.data, (item) => {
                        if (item.user !== null) {
                            return item
                        }
                    })
                })
                // show modal
                const {isShowModal} = this.state;
                if (genDoctorResponse.data.length !== 0 && isShowModal) {
                    if (_.every(_.filter(genDoctorResponse.data, (item) => {
                        if (item.user !== null) {
                            return item
                        }
                    }), {user: {status: "Inactive"}})) {

                    } else {

                        this.setState({
                            isVisible: true,
                            isShowModal: !isShowModal
                        })
                    }
                }
                this.hideDialog();
            } else if (genDoctorResponse.status === 401) {
                this.hideDialog();
                this.setState({genDoctorList: []})
                // this.showToastAlert(genDoctorResponse.message);
            } else {
                this.hideDialog();
                this.setState({genDoctorList: []})
                // this.showToastAlert(genDoctorResponse.message);
            }
            this.hideDialog()
        } else {
            this.hideDialog()
        }
    }

    onGeneralDoctorPress = (item) => {
        const {navigation} = this.props;
        const {navigate} = navigation;
        Keyboard.dismiss();
        navigate("DoctorDetail", {data: item})
    }

    _renderItem = (item, index) => {
        return (
            <TouchableOpacity activeOpacity={1} delayPressIn={0} onPress={() => this.onGeneralDoctorPress(item)}>
                <ListItemContainer>
                    <ListIcon source={PATIENT_HOME_SCREEN_IMAGES.LIST_DOCTOR_ICON}/>
                    <Spacer row={2}/>
                    <CenterContainer>
                        <NameText>{item.user.name}</NameText>
                        <Spacer space={1}/>
                        <CategoryText>{item.specialization}</CategoryText>
                        <Spacer space={1}/>
                        <RatingView
                            isDisable={true}
                            size={4.5}
                            rateCount={0}
                        />
                    </CenterContainer>
                    <Spacer row={2}/>
                    <RightContainer>
                        <ChargesText>{`${"$ " + item.charges}`}</ChargesText>
                    </RightContainer>
                </ListItemContainer>
            </TouchableOpacity>
        )
    };

    _renderHeader = () => {
        const {navigation} = this.props;
        return (
            <Header
                backgroundColor={COLORS.WHITE_COLOR}
                barStyle={"dark-content"}
                statusBarProps={{
                    translucent: true,
                }}
                leftComponent={(
                    <TouchableOpacity activeOpacity={1} delayPressIn={0} style={{padding: 12}}
                                      onPress={() => navigation.openDrawer()}>
                        <Image source={DRAWER_ICONS.DRAWER_ICON}/>
                    </TouchableOpacity>
                )}
                centerComponent={{
                    text: STRINGS.GENERAL_DOCTORS_TEXT, style: {
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
        const {search} = this.state;
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
                        size={wp(8)}/>
                </View>
            </View>
        );
    }

    updateSearch = (searchValue) => {
        this.setState({search: searchValue});
        // const {accessToken} = this.state;
        // if (this.isConnected()) {
        //     this.props.GetGenDoctorApi({
        //         searchText: searchValue,
        //         token: accessToken
        //     })
        // } else {
        //     this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
        // }
    };

    filterList = (requestData) => {
        return requestData.filter((listItem) =>
          listItem.user.name
            .toLowerCase()
            .includes(this.state.search.toLowerCase())
        );
      };

    _renderCustomLoader = () => {
        const {isLoading} = this.state;
        return (
            <OrientationLoadingOverlay visible={isLoading} message="Loading.."/>
        )
    };

    render() {
        const {genDoctorList, isVisible} = this.state;
        Moment.locale('en');
        return (
            <SafeAreaViewContainer>
                {this._renderHeader()}
                {this._renderSearchBar()}
                <MainContainer style={{backgroundColor: COLORS.WHITE_COLOR}}>
                    <Spacer space={2}/>
                    {(genDoctorList.length !== 0)
                        ?
                        <FlatList
                            keyboardShouldPersistTaps={"handled"}
                            showsVerticalScrollIndicator={false}
                            data={this.filterList(genDoctorList)}
                            renderItem={({item, index}) => this._renderItem(item, index)}
                        />
                        :
                        <NoDataFoundComponent title={"No general doctor found!"}/>
                    }
                </MainContainer>
                <Modal
                    animationType={"fade"}
                    transparent={false}
                    visible={isVisible}
                    onRequestClose={() => {
                        this.setState({isVisible: false})
                    }}>
                    <ActiveDoctor
                        data={genDoctorList}
                        onViewDetails={(details) => this.props.navigation.navigate("DoctorDetail", {data: details})}
                        onStartConsultationPress={(details) => this.props.navigation.navigate("startConsultation", {data: details})}
                        closeModal={() =>
                            this.setState({isVisible: !isVisible})
                        }
                    />
                </Modal>
                {this._renderCustomLoader()}
            </SafeAreaViewContainer>
        )
    }
};

const mapStateToProps = state => ({
    GetGenDoctorState: state.GenDoctorReducer,
});

// ----------------------------------------

const mapDispatchToProps = (dispatch) => {
    return {
        GetGenDoctorApi: (payload) => dispatch(GetGenDoctorAction(payload)),
    };
};

// ----------------------------------------

export default connect(mapStateToProps, mapDispatchToProps)(GeneralDoctorsListing);
