import styled from 'styled-components/native/dist/styled-components.native.esm'
import COLORS from "../../../../../themes/Colors";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { FONT } from "../../../../../themes/FontSizes";
import { FONT_FAMILY } from "../../../../../themes/FontFamilies";


const TitleText = styled.Text`
color: ${COLORS.BLACK_COLOR};
fontSize: ${FONT.TextMedium};
fontFamily: ${FONT_FAMILY.PoppinsRegular};
fontWeight: bold;
`;

const TextAreaContainer = styled.View`
paddingHorizontal: 10;
paddingVertical: 3;
borderColor: ${COLORS.GREY_BORDER_COLOR};
borderWidth: 2;
borderRadius: 10; 
width: ${wp(76)}; 
height: ${hp(15)};
`;

const TextInputHeading = styled.Text`
color: ${ COLORS.BLACK_COLOR};
fontSize: ${ FONT.TextNormalX};
fontFamily: ${ FONT_FAMILY.PoppinsSemiBold};
width: ${ wp("76%")};
`;

export {
    TitleText,
    TextAreaContainer,
    TextInputHeading,

}
