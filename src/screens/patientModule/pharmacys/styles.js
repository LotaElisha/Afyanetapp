import styled from "styled-components/native/dist/styled-components.native.esm";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import COLORS from "../../../themes/Colors";
import {FONT} from "../../../themes/FontSizes";
import {FONT_FAMILY} from "../../../themes/FontFamilies";

const CenterContainer = styled.View`
width: ${wp("62%")};
paddingTop: ${wp("2%")};
`;

const AddressText = styled.Text`
color: ${COLORS.LIGHT_APP_THEME_COLOR};
fontSize: ${FONT.TextSmallX};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold}; 
`;

 const NoRecordsFoundContainer = styled.View`
width: ${wp("90%")};
alignItems: center;
justifyContent: center;
paddingVertical: ${wp("35%")};
`;

 const NoRecordsFoundText = styled.Text`
 color: ${COLORS.LIGHT_APP_THEME_COLOR};
font-size: ${FONT.TextLarge};
`;

export {
    CenterContainer,
    AddressText,
    NoRecordsFoundContainer,
    NoRecordsFoundText
}
