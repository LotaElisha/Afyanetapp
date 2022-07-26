import styled from 'styled-components/native'
import COLORS from "../../../../themes/Colors";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { FONT } from "../../../../themes/FontSizes";
import { FONT_FAMILY } from "../../../../themes/FontFamilies";
import { Platform } from 'react-native';


const PleaseLoginText = styled.Text`
color: ${COLORS.DARK_GREY_COLOR};
fontSize: ${FONT.TextSmallX};
fontFamily: ${FONT_FAMILY.PoppinsRegular};
`;

const ForgetPasswordText = styled.Text`
width: ${wp("76%")};
textAlign: right;
color: ${COLORS.BLACK_COLOR};
fontSize: ${FONT.TextNormal};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold};
`;

const OrText = styled.Text`
color: ${COLORS.BLACK_COLOR};
fontSize: ${FONT.TextNormal};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold};
`;

const SocialButtonsContainer = styled.View`
flexDirection: row;
paddingVertical:10;
width: ${Platform.OS === 'ios' ? wp("60%") : wp("50%")};
justifyContent: space-between;
alignItems:center;
`;

const RegisterText = styled.Text`
color: ${COLORS.BLACK_COLOR};
fontSize: ${FONT.TextNormal};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold};
`;



export {
    PleaseLoginText,
    ForgetPasswordText,
    OrText,
    SocialButtonsContainer,
    RegisterText
}
