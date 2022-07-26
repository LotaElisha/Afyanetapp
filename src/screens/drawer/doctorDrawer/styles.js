import React from 'react';
import {StyleSheet} from "react-native";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import COLORS from "../../../themes/Colors";
import {FONT} from "../../../themes/FontSizes";
import {FONT_FAMILY} from "../../../themes/FontFamilies";


const styles = StyleSheet.create({
    headerStyle: {
        // marginTop: wp(3),
        backgroundColor: 'rgba(0, 0, 0, 0.12)',
        paddingVertical: wp(2),
        width: wp(55),
        borderBottomRightRadius: wp(12),
        borderTopRightRadius: wp(12),
        flexDirection: 'row'
    },
    imageStyle: {
        backgroundColor: COLORS.APP_BACKGROUND_COLOR,
        marginLeft: wp(3),
        width: wp(14),
        height: wp(14),
        borderRadius: wp(7)
    },
    textViewStyle: {
        width: wp(35)
    },
    textStyle1: {
        color: COLORS.WHITE_COLOR,
        lineHeight: wp(7),
        fontSize: FONT.TextSmallX,
        fontFamily: FONT_FAMILY.PoppinsRegular
    },
    textStyle2: {
        color: COLORS.WHITE_COLOR,
        fontSize: FONT.TextNormal,
        fontFamily: FONT_FAMILY.PoppinsBold
    },
    labelTextStyle: {
        color: COLORS.WHITE_COLOR,
        fontFamily: FONT_FAMILY.PoppinsSemiBold,
        fontSize: FONT.TextSmallX,
        width: wp(48),
        marginLeft: wp(-5)
    }

});

export {styles};
