import styled from 'styled-components/native'
import COLORS from "../../../themes/Colors";
import {FONT} from "../../../themes/FontSizes";
import {FONT_FAMILY} from "../../../themes/FontFamilies";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import { StyleSheet } from "react-native";
const CenterContainer = styled.View`
width: ${wp("40%")};
paddingTop: ${wp("2%")};
`;

const CategoryText = styled.Text`
color: ${COLORS.APP_THEME_COLOR};
fontSize: ${FONT.TextSmallX};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold}; 
`;

const DateTimeText = styled.Text`
color: ${COLORS.LIGHT_GREY_COLOR};
fontSize: ${FONT.TextSmallX};
`;

const RightContainer = styled.View`
paddingTop: ${wp("2%")};
width: ${wp("18%")};
alignItems: flex-end;
`;

const ChargesText = styled.Text`
color: ${COLORS.APP_THEME_COLOR};
fontSize: ${FONT.TextSmallX};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold}; 
`;
const styles = StyleSheet.create({
    modalContent: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0
    },
    container: {  
        flex: 1,  
        alignItems: 'center',  
        justifyContent: 'center',  
        backgroundColor: COLORS.WHITE_COLOR,  
      }, 
});
export {
    CenterContainer,
    CategoryText,
    RightContainer,
    ChargesText,
    DateTimeText,
    styles
}
