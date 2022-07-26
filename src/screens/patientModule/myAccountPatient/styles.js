import styled from 'styled-components/native'
import COLORS from "../../../themes/Colors";
import {FONT} from "../../../themes/FontSizes";
import {FONT_FAMILY} from "../../../themes/FontFamilies";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";


const ScreenNameText = styled.Text`
color: ${COLORS.BLACK_COLOR};
fontSize: ${FONT.TextLarge};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold}; 
`;

const ProfileDetailsContainer = styled.View`
width: ${wp("95%")};
paddingVertical: ${wp("3.5%")};
flexDirection: row;
alignItems: center;
`;

const ProfileImage = styled.Image`
height: ${wp("18%")};
width: ${wp("18%")};
borderRadius: ${wp("9%")};
`;

const CenterContainer = styled.View`
width: ${wp("65%")};
`;

const UserNameText = styled.Text`
color: ${COLORS.BLACK_COLOR};
fontSize: ${FONT.TextNormalX};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold}; 
`;

const UserEmailPhoneText = styled.Text`
color: ${COLORS.LIGHT_GREY_COLOR};
fontSize: ${FONT.TextSmallX};
fontFamily: ${FONT_FAMILY.PoppinsRegular}; 
`;

const ItemContainer = styled.View`
width: ${wp("95%")};
flexDirection: row;
justifyContent: space-between;
alignItems: center;
`;

const ItemText = styled.Text`
color: ${COLORS.LIGHT_BLACK_COLOR};
fontSize: ${FONT.TextNormal};
fontFamily: ${FONT_FAMILY.PoppinsRegular}; 
`;

export {
    ScreenNameText,
    ProfileDetailsContainer,
    ProfileImage,
    CenterContainer,
    UserNameText,
    UserEmailPhoneText,
    ItemContainer,
    ItemText
}
