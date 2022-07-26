import styled from 'styled-components/native'
import COLORS from "../../../themes/Colors";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import {FONT} from "../../../themes/FontSizes";
import {FONT_FAMILY} from "../../../themes/FontFamilies";

const SlideContainer = styled.View`
flex: 1;
justifyContent: center;
alignItems: center;
backgroundColor: ${COLORS.APP_BACKGROUND_COLOR}
`;

const ChooseUserTypeText = styled.Text`
width: ${wp("90%")};
textAlign: center;
color: ${COLORS.BLACK_COLOR};
fontFamily: ${FONT_FAMILY.MontserratSemiBold};
fontSize: ${FONT.TextLarge};
`;

const ChooseTypeDescriptionText = styled.Text`
width: ${wp("95%")};
color: ${COLORS.DARK_GREY_COLOR};
fontFamily: ${FONT_FAMILY.PoppinsRegular};
textAlign: center;
fontSize: ${FONT.TextNormalX};
`;

const GetStartedButtonView = styled.TouchableOpacity`
flexDirection: row;
alignItems: center;
paddingVertical: ${wp("3%")};
backgroundColor: ${COLORS.APP_THEME_COLOR};
width: ${wp("100%")};
paddingLeft: ${wp("15%")};
`;

const GetStartedText = styled.Text`
color: ${COLORS.WHITE_COLOR};
fontSize: ${FONT.TextMediumX};
fontFamily: ${FONT_FAMILY.MontserratSemiBold};
`;

const ActiveDotView = styled.View`
backgroundColor: ${COLORS.APP_THEME_COLOR};
width: 8;
height: 8;
borderRadius: 4;
marginLeft: 3;
marginRight: 3;
marginTop: 3;
marginBottom: 3;
`;

const InActiveDotView = styled.View`
backgroundColor: ${COLORS.DISABLE_APP_THEME_COLOR};
width: 8;
height: 8;
borderRadius: 4;
marginLeft: 3;
marginRight: 3;
marginTop: 3;
marginBottom: 3;
`;

export {
    SlideContainer,
    ChooseUserTypeText,
    ChooseTypeDescriptionText,
    GetStartedButtonView,
    GetStartedText,
    ActiveDotView,
    InActiveDotView
}
