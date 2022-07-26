import styled from 'styled-components/native'
import COLORS from "../../../themes/Colors";
import {FONT} from "../../../themes/FontSizes";
import {FONT_FAMILY} from "../../../themes/FontFamilies";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";

const ImageBackgroundComponent = styled.ImageBackground`
flex: 1;
resizeMode: cover;
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

const ConsultationsContainer = styled.View`
width: ${wp("90%")};
`;

const HeadingText = styled.Text`
color: ${COLORS.LIGHT_BLACK_COLOR};
fontSize: ${FONT.TextNormal};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold}; 
`;

const ListItemCenterContainer = styled.View`
width: ${wp("44%")};
paddingTop: ${wp("2%")};
`;

const ListItemRightContainer = styled.View`
width: ${wp("16%")};
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

export {
    ImageBackgroundComponent,
    HeaderRightContainer,
    HeaderText,
    ConsultationsContainer,
    HeadingText,
    ListItemCenterContainer,
    ListItemRightContainer,
    SpecificationText,
    DateTimeText,
    ChargesText
}
