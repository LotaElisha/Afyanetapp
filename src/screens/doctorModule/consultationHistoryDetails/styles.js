import styled from 'styled-components/native'
import COLORS from "../../../themes/Colors";
import {FONT} from "../../../themes/FontSizes";
import {FONT_FAMILY} from "../../../themes/FontFamilies";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";

const ImageBackgroundComponent = styled.ImageBackground`
width: ${'100%'};
 aspectRatio: 1.27;
`;
const CardContainerStyle = styled.View`
width: ${wp("100%")};
backgroundColor: ${COLORS.WHITE_COLOR};
paddingVertical: ${wp("5%")};
paddingHorizontal: ${wp("3%")};
alignItems: center;
borderRadius: ${wp("8%")}
`;
const AbsoluteContainer = styled.View`
alignItems: center;
marginTop: ${-wp("75%")};
`;

const VerticalRowView = styled.View`
width: ${'100%'};
flexDirection: row;  
`;

const HorizontalRowView = styled.View`
 flexDirection: column; 
`;
const RoundImageContainer = styled.View`
 width: 84;
 height: 84;
 marginHorizontal: 20;
 marginVertical: 20;
 borderRadius: 84;
 overflow: hidden;
 justifyContent:center
 alignItems:center
`;

const DetailsContainer = styled.View`
width: ${'100%'};
 flexDirection: column; 
 paddingVertical:10;
 paddingHorizontal:20;
`;

const BlueTextBox = styled.View`
alignItems: center;
width: ${wp(46)};
backgroundColor: ${COLORS.APP_THEME_COLOR};
color: ${COLORS.WHITE_COLOR};
fontSize: ${FONT.TextSmall};
fontFamily: ${FONT_FAMILY.PoppinsRegular}; 
marginVertical: 6;
paddingHorizontal:10;
paddingVertical:10;
borderRadius:8;
`;

const NameText = styled.Text`
color: ${COLORS.BLACK_COLOR};
fontSize: ${FONT.TextNormalX};
fontFamily: ${FONT_FAMILY.PoppinsRegular}; 
marginVertical: 6;
`;

const BlueText = styled.Text`
color: ${COLORS.APP_THEME_COLOR};
fontSize: ${FONT.TextSmallX};
fontFamily: ${FONT_FAMILY.PoppinsRegular}; 
marginVertical: 6;
`;
const GreyText = styled.Text`
color: ${COLORS.GREY_COLOR};
fontSize: ${FONT.TextSmallX};
fontFamily: ${FONT_FAMILY.PoppinsRegular}; 
marginVertical: 6;
`;
const BlueBoldText = styled.Text`
color: ${COLORS.APP_THEME_COLOR};
fontSize: ${FONT.TextSmallX};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold}; 
marginVertical: 6;
`;
const GreyBoldText = styled.Text`
color: ${COLORS.LIGHT_BLACK_COLOR};
fontSize: ${FONT.TextSmallX};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold}; 
marginVertical: 6;
`;

const AcceptButton = styled.TouchableOpacity`
backgroundColor:${COLORS.ACCEPT_REQUEST_COLOR};
borderRadius:40;
flex:1;
marginHorizontal:10;
height:40;
alignItems: center;
justifyContent: center;
`;

const RejectButton = styled.TouchableOpacity`
backgroundColor:${COLORS.REJECT_REQUEST_COLOR};
borderRadius:40;
flex:1;
marginHorizontal:10;
height:40;
alignItems: center;
justifyContent: center;
`;

const WhiteText = styled.Text`
color: ${COLORS.WHITE_COLOR};
fontSize: ${FONT.TextSmall};
fontFamily: ${FONT_FAMILY.PoppinsRegular}; 
`;


export {
    ImageBackgroundComponent,
    CardContainerStyle,
    AbsoluteContainer,
    VerticalRowView,
    HorizontalRowView,
    RoundImageContainer,
    DetailsContainer,
    BlueTextBox,
    AcceptButton,
    RejectButton,
    WhiteText,
    NameText,
    BlueText,
    GreyText,
    BlueBoldText,
    GreyBoldText,

}
