import styled from 'styled-components/native'
import COLORS from "../../../themes/Colors";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { FONT } from "../../../themes/FontSizes";
import { FONT_FAMILY } from "../../../themes/FontFamilies";

const MainContainer = styled.View`
paddingHorizontal: 25;
paddingVertical: 25;
`;

const OptionText = styled.Text`
color: ${COLORS.BLACK_COLOR};
fontSize: ${FONT.TextSmallX};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold};
textAlign: left;
`;

const DetailAreaContainer = styled.View`
flexDirection: column;
justifyContent: center;
backgroundColor: ${COLORS.WHITE_COLOR}
`;

const BoldText = styled.Text`
color: ${ COLORS.BLACK_COLOR};
fontSize: ${ FONT.TextSmallX};
fontFamily: ${ FONT_FAMILY.PoppinsSemiBold};
width: ${ wp("72%")};
`;
const BoldBlueText = styled.Text`
paddingHorizontal: 10
color: ${ COLORS.APP_THEME_COLOR};
fontSize: ${ FONT.TextSmallX};
fontFamily: ${ FONT_FAMILY.PoppinsSemiBold};
`;

const RegularText = styled.Text`
color: ${ COLORS.BLACK_COLOR};
fontSize: ${ FONT.TextSmallX};
fontFamily: ${ FONT_FAMILY.PoppinsRegular};
width: ${ wp("72%")};
`;
const RegularBlueText = styled.Text`
paddingHorizontal: 10
color: ${ COLORS.APP_THEME_COLOR};
fontSize: ${ FONT.TextSmallX};
fontFamily: ${ FONT_FAMILY.PoppinsRegular};
`;



const SimpleRow = styled.View`
flexDirection: row;
justifyContent: center;
paddingVertical: 10;
`;

const CardsScrollView = styled.ScrollView` 

`;

const CardBackground = styled.TouchableOpacity` 
marginHorizontal: 15;
marginVertical: 20;
backgroundColor: ${COLORS.APP_THEME_COLOR};
width: ${260};
height: ${ 154};
borderRadius: 20;
`;

const AddIconButton = styled.TouchableOpacity`
width: ${50}; 
height: ${50};
borderRadius: 10;
marginTop: 20;
justifyContent: center;
alignItems: center;
backgroundColor: ${COLORS.APP_BACKGROUND_COLOR};
`;

const ButtonContainer = styled.View`
justifyContent: center;
alignItems: center;
`;

const CardTypeText = styled.Text`
color: ${COLORS.WHITE_COLOR};
fontSize: ${FONT.TextSmallX};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold};
textAlign: left;
position: absolute; 
left: 20; 
top: 20;
`;
const CardNumberText = styled.Text`
color: ${COLORS.WHITE_COLOR};
fontSize: ${FONT.TextSmallX};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold};
textAlign: right;
position: absolute; 
right: 20; 
top: 20;
`;
const BalanceText = styled.Text`
color: ${COLORS.WHITE_COLOR};
fontSize: ${FONT.TextExtraSmall};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold};
textAlign: left;
position: absolute; 
left: 20; 
bottom: 50;
`;

const BalanceValueText = styled.Text`
color: ${COLORS.WHITE_COLOR};
fontSize: ${FONT.TextMedium};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold};
textAlign: left;
position: absolute; 
left: 20; 
bottom: 20;
`;

const CardNameText = styled.Text`
color: ${COLORS.WHITE_COLOR};
fontSize: ${FONT.TextMedium};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold};
textAlign: left;
position: absolute; 
right: 20; 
bottom: 20;
`;
const SelectedMarkBG = styled.View`
width: 26;
height: 26; 
borderRadius: 13;
justifyContent: center;
alignItems: center;
backgroundColor: ${COLORS.WHITE_COLOR}; 
position: absolute;
bottom: -8; 
right: 20; 
zIndex: 10                
`;

const DottedLine = styled.View`
marginLeft: 5%;
height: 1; 
width: 90%;
borderRadius: 1;
borderWidth: 1; 
borderColor: ${COLORS.GREY_BORDER_COLOR};
borderStyle: dashed;
`;


export {
    MainContainer,
    OptionText,
    CardsScrollView,
    CardBackground,
    AddIconButton,
    DetailAreaContainer,
    BoldText,
    BoldBlueText,
    RegularText,
    RegularBlueText,
    ButtonContainer,
    SimpleRow,
    CardTypeText,
    CardNumberText,
    BalanceText,
    BalanceValueText,
    CardNameText,
    SelectedMarkBG,
    DottedLine,
}
