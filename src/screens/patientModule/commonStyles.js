import styled from "styled-components/native/dist/styled-components.native.esm";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import COLORS from "../../themes/Colors";
import {FONT} from "../../themes/FontSizes";
import {FONT_FAMILY} from "../../themes/FontFamilies";

const ListItemContainer = styled.View`
width: ${wp("90%")};
paddingVertical: ${wp("3.5%")};
paddingHorizontal: ${wp("2%")};
flexDirection: row;
alignItems: flex-start;
backgroundColor: ${COLORS.WHITE_COLOR_SHADE};
marginBottom: ${wp("4%")};
borderRadius: ${wp("3%")}
`;

const ListIcon = styled.Image`
height: ${wp("20%")}; 
width: ${wp("20%")}; 
resizeMode: contain
`;

const NameText = styled.Text`
color: ${COLORS.BLACK_COLOR};
fontSize: ${FONT.TextNormal};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold}; 
`;

export {
    ListItemContainer,
    ListIcon,
    NameText
}
