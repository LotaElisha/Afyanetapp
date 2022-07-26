import React from 'react';

import {Image, View, SafeAreaView, Text, TextInput, Alert,TouchableOpacity} from 'react-native';
import BaseClass from '../../../utils/BaseClass';
import COLORS from '../../../themes/Colors';

import { SafeAreaViewContainer,  } from '../../../utils/BaseStyles';

import {Header} from "react-native-elements"
import TopTab from "./consultationHistoryHome/topTabBar";
import { DRAWER_ICONS, PATIENT_HOME_SCREEN_IMAGES } from "../../../utils/ImagePaths";
import { FONT } from "../../../themes/FontSizes";
import { FONT_FAMILY } from "../../../themes/FontFamilies";


export default class ConsultationsHistory extends BaseClass {
    constructor(props) {
        super(props);
        const {route} = this.props;
        this.state = {
            isLogOut: false,
            authToken: '',
            searchText: '',
        };
    }

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
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Image
                            source={DRAWER_ICONS.DRAWER_ICON}
                        />
                    </TouchableOpacity>
                )}
                centerComponent={{
                    text: 'History', style: {
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

    render() {
        const {navigation} = this.props;
        const {searchText} = this.state;
        return (
            <SafeAreaViewContainer>
                {this._renderHeader()}
                <View style={{backgroundColor: COLORS.backgroundColor, flex: 1}}>
                    <TopTab props={this.props}/>
                </View>
            </SafeAreaViewContainer>
        );
    }
}
