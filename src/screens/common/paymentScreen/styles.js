import styled from 'styled-components/native'
import COLORS from "../../../themes/Colors";
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from "react-native-responsive-screen";
import {FONT} from "../../../themes/FontSizes";
import {FONT_FAMILY} from "../../../themes/FontFamilies";


const PleaseLoginText = styled.Text`
color: ${COLORS.DARK_GREY_COLOR};
fontSize: ${FONT.TextSmallX};
fontFamily: ${FONT_FAMILY.PoppinsRegular};
`;

const InputContainer = styled.View`
paddingHorizontal: 5;
paddingVertical: 3;
borderColor: ${COLORS.GREY_BORDER_COLOR};
borderWidth: 2;
borderRadius: 10; 
width: ${wp(76)}; 
height: ${wp(15)};
`;


export {
    PleaseLoginText,
    InputContainer
}
