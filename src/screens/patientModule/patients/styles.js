import styled from 'styled-components/native'
import COLORS from "../../../themes/Colors";
import {FONT} from "../../../themes/FontSizes";
import {FONT_FAMILY} from "../../../themes/FontFamilies";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";

const CenterContainer = styled.View`
width: ${wp("40%")};
paddingTop: ${wp("2%")};
`;

const RelationText = styled.Text`
color: ${COLORS.APP_THEME_COLOR};
fontSize: ${FONT.TextSmallX};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold}; 
`;

const AgeText = styled.Text`
color: ${COLORS.LIGHT_GREY_COLOR};
fontSize: ${FONT.TextSmallX};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold}; 
`;

const RightComponent = styled.View`
flexDirection: row;
paddingTop: ${wp("2%")};
width: ${wp("18%")};
justifyContent: space-evenly;
`;

export {
    CenterContainer,
    RelationText,
    AgeText,
    RightComponent
}
