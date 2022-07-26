import React from 'react';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import COLORS from '../../../themes/Colors';
import {TouchableOpacity, Text} from 'react-native';
import {NewButtonViewContainer} from './styles';
import {FONT} from '../../../themes/FontSizes';
import {FONT_FAMILY} from "../../../themes/FontFamilies";


const NewPrimaryButton = ({fontFamily, disabled, btnText, width, onPress, verticalPaddingWithText, borderRadius, borderColor, color, textColor, textSize, isTextBold}) => {
    return (
        <TouchableOpacity disabled={(disabled) ? disabled : false} activeOpacity={0.8} onPress={onPress}>
            <NewButtonViewContainer style={{
                borderWidth: 1,
                borderColor: (borderColor) ? borderColor : COLORS.TRANSPARENT,
                backgroundColor: (color) ? color : COLORS.APP_THEME_COLOR,
                borderRadius: (borderRadius) ? borderRadius : 0,
                width: (width) ? wp(`${width}%`) : wp('25%'),
                paddingVertical: (verticalPaddingWithText) ? wp(`${verticalPaddingWithText}%`) : wp('4%'),
            }}>
                <Text
                    style={{
                        fontFamily: fontFamily ? fontFamily : FONT_FAMILY.PoppinsRegular,
                        fontWeight: (isTextBold) ? 'bold' : 'normal',
                        color: (textColor) ? textColor : COLORS.WHITE_COLOR,
                        fontSize: textSize ? textSize : FONT.TextNormal,
                    }}>{btnText}</Text>
            </NewButtonViewContainer>
        </TouchableOpacity>
    );
};

const CancelPrimaryButton = ({fontFamily, disabled, btnText, width, onPress, verticalPaddingWithText, borderRadius, borderColor, color, textColor, textSize, isTextBold}) => {
    return (
        <TouchableOpacity disabled={(disabled) ? disabled : false} activeOpacity={0.8} onPress={onPress}>
            <NewButtonViewContainer style={{
                borderWidth: 1,
                borderColor: (borderColor) ? borderColor : COLORS.APP_THEME_COLOR,
                // backgroundColor: (color) ? color : COLORS.APP_THEME_COLOR,
                borderRadius: (borderRadius) ? borderRadius : 0,
                width: (width) ? wp(`${width}%`) : wp('25%'),
                paddingVertical: (verticalPaddingWithText) ? wp(`${verticalPaddingWithText}%`) : wp('4%'),
            }}>
                <Text
                    style={{
                        fontFamily: fontFamily ? fontFamily : FONT_FAMILY.PoppinsRegular,
                        fontWeight: (isTextBold) ? 'bold' : 'normal',
                        color: (textColor) ? textColor : COLORS.APP_THEME_COLOR,
                        fontSize: textSize ? textSize : FONT.TextNormal,
                    }}>{btnText}</Text>
            </NewButtonViewContainer>
        </TouchableOpacity>
    );
};

export {
    NewPrimaryButton,
    CancelPrimaryButton
}
