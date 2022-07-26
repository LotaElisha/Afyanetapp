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
height: ${hp(18)};
`;

const TextInputHeading = styled.Text`
color: ${ COLORS.BLACK_COLOR};
fontSize: ${ FONT.TextNormalX};
fontFamily: ${ FONT_FAMILY.PoppinsSemiBold};
width: ${ wp("76%")};
`;
const UploadText = styled.Text`
paddingHorizontal: 10
color: ${ COLORS.APP_THEME_COLOR};
fontSize: ${ FONT.TextNormalX};
fontFamily: ${ FONT_FAMILY.PoppinsRegular};
`;

const DocumentBackground = styled.View`
flexDirection: row;
justifyContent: center;
alignItems: center;
marginVertical :20
paddingHorizontal: 10;
paddingVertical: 3;
borderColor: ${COLORS.APP_THEME_COLOR};
backgroundColor: ${COLORS.LIGHT_BLUE_BACKGROUND_COLOR}
borderWidth: 2;
borderStyle: dashed
borderRadius: 10; 
width: ${wp(76)}; 
height: ${hp(7)};
`;

const InvisibleButton = styled.TouchableOpacity`
flexDirection: row;
justifyContent: center;
`;

export {
    TitleText,
    TextAreaContainer,
    TextInputHeading,
    DocumentBackground,
    InvisibleButton,
    UploadText
}
