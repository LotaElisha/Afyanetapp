import styled from 'styled-components/native'
import COLORS from "../../../../../themes/Colors";
import {FONT} from "../../../../../themes/FontSizes";
import {FONT_FAMILY} from "../../../../../themes/FontFamilies";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";

const TitleText = styled.Text`
color: ${COLORS.BLACK_COLOR};
fontSize: ${FONT.TextMediumX};
fontFamily: ${FONT_FAMILY.MontserratSemiBold};
`;

const DescriptionText = styled.Text`
color: ${COLORS.DARK_GREY_COLOR};
fontSize: ${FONT.TextNormal};
fontFamily: ${FONT_FAMILY.MontserratRegular};
textAlign: center;
width: ${wp("76%")}
`;

const ResendText = styled.Text`
color: ${COLORS.APP_THEME_COLOR};
fontSize: ${FONT.TextNormal};
fontFamily: ${FONT_FAMILY.MontserratRegular};
fontWeight: bold
`;

export {
    TitleText,
    DescriptionText,
    ResendText
}
