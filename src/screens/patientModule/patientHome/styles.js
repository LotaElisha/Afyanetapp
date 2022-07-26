import styled from 'styled-components/native'
import COLORS from "../../../themes/Colors";
import { FONT } from "../../../themes/FontSizes";
import { FONT_FAMILY } from "../../../themes/FontFamilies";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const ImageBackgroundComponent = styled.ImageBackground`
flex: 1;
resizeMode: cover;
justifyContent: center;
`;

const CaloriesBurntContainer = styled.View`
width: ${wp("90%")};
paddingVertical: ${wp("3%")};
paddingHorizontal: ${wp("2%")};
flexDirection: row;
alignItems: center;
backgroundColor: ${COLORS.WHITE_COLOR_SHADE};
borderRadius: ${wp("3%")};
`;

const TreadmillImage = styled.Image`
width: ${wp("34%")};
height: ${wp("38%")};
resizeMode: contain;
`;

const TextContainer = styled.View`
width: ${wp("51%")};
`;

const GreetingsText = styled.Text`
color: ${COLORS.APP_THEME_COLOR};
fontSize: ${FONT.TextMedium};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold};
`;

const CaloriesCountText = styled.Text`
color: ${COLORS.LIGHT_GREY_COLOR};
fontSize: ${FONT.TextSmallX};
fontFamily: ${FONT_FAMILY.PoppinsRegular};
`;

const HeaderRightContainer = styled.View`
flexDirection: row;
width: ${wp("50%")};
alignItems: center;
justifyContent: flex-end;
`;

const HeaderText = styled.Text`
color: ${COLORS.WHITE_COLOR};
fontSize: ${FONT.TextNormal};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold};
`;

const HeaderImage = styled.Image`
height: ${wp("10%")}; 
width: ${wp("10%")}; 
borderRadius: ${wp("5%")};
resizeMode: cover
`;

const ConsultationsContainer = styled.View`
width: ${wp("90%")};
`;

const HeadingText = styled.Text`
color: ${COLORS.LIGHT_BLACK_COLOR};
fontSize: ${FONT.TextNormal};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold}; 
`;

const ListItemCenterContainer = styled.View`
width: ${wp("40%")};
paddingTop: ${wp("2%")};
`;

const ListItemRightContainer = styled.View`
width: ${wp("18%")};
paddingTop: ${wp("2%")};
alignItems: flex-end;
`;

const SpecificationText = styled.Text`
color: ${COLORS.APP_THEME_COLOR};
fontSize: ${FONT.TextSmallX};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold}; 
`;

const DateTimeText = styled.Text`
color: ${COLORS.LIGHT_GREY_COLOR};
fontSize: ${FONT.TextSmallX};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold}; 
`;

const ChargesText = styled.Text`
color: ${COLORS.APP_THEME_COLOR};
fontSize: ${FONT.TextSmallX};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold}; 
`;
const NoRecordsFoundContainer = styled.View`
width: ${wp("90%")};
height: ${wp("30%")};
alignItems: center;
justifyContent: center;
paddingVertical: ${wp("10%")};
`;

const NoRecordsFoundText = styled.Text`
color: ${COLORS.LIGHT_APP_THEME_COLOR};
font-size: ${FONT.TextLarge};
`;

export {
    ImageBackgroundComponent,
    CaloriesBurntContainer,
    TreadmillImage,
    TextContainer,
    GreetingsText,
    CaloriesCountText,
    HeaderRightContainer,
    HeaderText,
    HeaderImage,
    ConsultationsContainer,
    HeadingText,
    ListItemCenterContainer,
    ListItemRightContainer,
    SpecificationText,
    DateTimeText,
    ChargesText,
    NoRecordsFoundContainer,
    NoRecordsFoundText
}
