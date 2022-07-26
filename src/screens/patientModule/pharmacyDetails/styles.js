import styled from 'styled-components/native'
import COLORS from "../../../themes/Colors";
import {FONT} from "../../../themes/FontSizes";
import {FONT_FAMILY} from "../../../themes/FontFamilies";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";

const PharmacyBackground = styled.ImageBackground`
width: ${wp(100)};
height: ${wp(48)};
resizeMode: stretch;
`

const BackgroundImageUpperContainer = styled.View`
flex:1;
alignItems: center;
justifyContent: center;
backgroundColor: rgba(0,0,0,0.6)
`

const UpperText = styled.Text`
color: ${COLORS.WHITE_COLOR};
width: ${wp(90)};
fontSize: ${FONT.TextMedium};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold};
`

const LowerText = styled.Text`
color: ${COLORS.WHITE_COLOR};
width: ${wp(90)};
fontSize: ${FONT.TextSmall};
fontFamily: ${FONT_FAMILY.PoppinsRegular};
`

const PharmacyNameText = styled.Text`
color: ${COLORS.BLACK_COLOR};
width: ${wp(90)};
fontSize: ${FONT.TextNormal};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold};
`

const ContactDetailsText = styled.Text`
color: ${COLORS.BLACK_COLOR};
width: ${wp(86)};
fontSize: ${FONT.TextSmallX};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold};
`

const ContactContainer = styled.View`
width: ${wp("86%")};
paddingVertical: ${wp("3.5%")};
paddingHorizontal: ${wp("2%")};
flexDirection: row;
alignItems: flex-start;
backgroundColor: ${COLORS.WHITE_COLOR_SHADE};
marginBottom: ${wp("4%")};
borderRadius: ${wp("3%")}
`;

const ContactRightContainer = styled.View`
width: ${wp("60%")};
paddingTop: ${wp("2%")};
`;

const EmailText = styled.Text`
color: ${COLORS.APP_THEME_COLOR};
fontSize: ${FONT.TextSmall};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold}; 
`;

const ExtraDetailsText = styled.Text`
color: ${COLORS.LIGHT_GREY_COLOR};
fontSize: ${FONT.TextSmall};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold}; 
`;

export {
    PharmacyBackground,
    BackgroundImageUpperContainer,
    UpperText,
    LowerText,
    PharmacyNameText,
    ContactDetailsText,
    ContactContainer,
    ContactRightContainer,
    EmailText,
    ExtraDetailsText
}
