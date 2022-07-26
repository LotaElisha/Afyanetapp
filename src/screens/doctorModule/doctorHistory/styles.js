import styled from "styled-components/native/dist/styled-components.native.esm";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import COLORS from "../../../themes/Colors";
import {FONT} from "../../../themes/FontSizes";
import {FONT_FAMILY} from "../../../themes/FontFamilies";

const CenterContainer = styled.View`
width: ${wp("40%")};
paddingTop: ${wp("2%")};
`;

const AgeText = styled.Text`
color: ${COLORS.LIGHT_APP_THEME_COLOR};
fontSize: ${FONT.TextSmallX};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold}; 
`;
const RightContainer = styled.View`
width: ${wp("30%")};
paddingTop: ${wp("2%")};
paddingRight: ${wp("1%")};
`;
const DateTimeText = styled.Text`
color: ${COLORS.LIGHT_GREY_COLOR};
fontSize: ${FONT.TextSmallX};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold}; 
`;
const CompletedConsultationText = styled.Text`
color: ${COLORS.BLACK_COLOR};
fontSize: ${FONT.TextNormal};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold};
marginHorizontal:${wp('3%')};
paddingHorizontal:${wp('3%')};
`;
export {
    CenterContainer,
    AgeText,
    RightContainer,
    DateTimeText,
    CompletedConsultationText
}
