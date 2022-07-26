import styled from 'styled-components/native'
import COLORS from "../../../themes/Colors";
import { FONT } from "../../../themes/FontSizes";
import { FONT_FAMILY } from "../../../themes/FontFamilies";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import{StyleSheet} from "react-native";

const SpecializationText = styled.Text`
color: ${COLORS.BLACK_COLOR};
fontSize: ${FONT.TextNormal};
fontFamily: ${FONT_FAMILY.MontserratSemiBold};
marginHorizontal:${wp(2)};
`;

const DescriptionText = styled.Text`
color: ${COLORS.DARK_GREY_COLOR};
fontSize: ${FONT.TextNormal};
fontFamily: ${FONT_FAMILY.MontserratRegular};
textAlign: center;
width: ${wp("76%")}
`;

const SpecificationText = styled.Text`
color: ${COLORS.APP_THEME_COLOR};
fontSize: ${FONT.TextSmallX};
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

const HorizontalItemContainer = styled.View`
width: ${wp("35%")};
paddingVertical: ${wp("3.5%")};
paddingHorizontal: ${wp("2%")};
flexDirection: row;
alignItems: flex-start;
backgroundColor: ${COLORS.WHITE_COLOR_SHADE};
marginBottom: ${wp("4%")};
borderRadius: ${wp("3%")}
`;

const HorizontalListIcon = styled.Image`

resizeMode: contain
`;
const styles = StyleSheet.create({
    container: {  
        flex: 1,  
        alignItems: 'center',  
        justifyContent: 'center',  
        backgroundColor: COLORS.WHITE_COLOR, 
      }, 
})

export {
    SpecializationText,
    DescriptionText,
    SpecificationText,
    ListItemCenterContainer,
    ListItemRightContainer,
    DateTimeText,
    ChargesText,
    HorizontalItemContainer,
    HorizontalListIcon,
    styles

}
