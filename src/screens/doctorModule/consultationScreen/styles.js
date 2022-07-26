import styled from 'styled-components/native'
import COLORS from "../../../themes/Colors";
import { FONT } from "../../../themes/FontSizes";
import { FONT_FAMILY } from "../../../themes/FontFamilies";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import AutogrowInput from 'react-native-autogrow-input';
import { createImageProgress } from 'react-native-image-progress';
import FastImage from 'react-native-fast-image';


const Image = createImageProgress(FastImage);

const MainContainer = styled.View`
flex:1;
width: ${wp("100%")};
backgroundColor: ${COLORS.WHITE_COLOR};
alignItems: center;
`;

const TitleText = styled.Text`
color: ${COLORS.LIGHT_BLACK_COLOR};
fontSize: ${FONT.TextNormal};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold}; 
marginVertical: 6;
`;

const RBText = styled.Text`
color: ${COLORS.LIGHT_BLACK_COLOR};
fontSize: ${FONT.TextNormalX};
fontFamily: ${FONT_FAMILY.PoppinsRegular}; 
marginVertical: 6;
`;
const Seprator = styled.View`
width: ${wp("95%")};
height:${wp("0.1%")};
backgroundColor: ${COLORS.APP_THEME_COLOR};
alignItems: center;
`;

const CancelButton = styled.TouchableOpacity`
backgroundColor:${COLORS.REJECT_REQUEST_COLOR};
borderRadius:20;
height:20;
paddingHorizontal:10;
alignItems: center;
justifyContent: center;
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

const ChatContainer = styled.ScrollView`
 flexDirection: column; 
 paddingTop: 10;
 paddingBottom: 50;
 paddingHorizontal: 10;
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
color: ${COLORS.DARK_GREY_COLOR};
fontSize: ${FONT.TextSmallX};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold}; 
marginVertical: 6;
`;

const WhiteText = styled.Text`
color: ${COLORS.WHITE_COLOR};
fontSize: ${FONT.TextSmall};
fontFamily: ${FONT_FAMILY.PoppinsRegular}; 
`;


const TimeText = styled.Text`
color: ${COLORS.GREY_COLOR};
fontSize: ${FONT.TextExtraSmallX};
fontFamily: ${FONT_FAMILY.PoppinsRegular}; 
marginVertical: 6;
width: ${'100%'};
textAlign: center;
`;

const MessageBubble = styled.View`
borderRadius: 10;
marginTop: 20;
marginRight: 0;
marginLeft: 0;
paddingHorizontal: 10;
paddingVertical: 10;
flexDirection: column;
alignItems: flex-end;
`;

const MessageBubbleLeft = styled(MessageBubble)`
    backgroundColor:${COLORS.APP_THEME_COLOR};
`;

const MessageBubbleRight = styled(MessageBubble)`
    backgroundColor: ${COLORS.APP_BACKGROUND_COLOR};
`;

const MessageBubbleTextLeft = styled.Text`
    color: ${COLORS.WHITE_COLOR};
    fontSize: ${FONT.TextSmallX};
    fontFamily: ${FONT_FAMILY.PoppinsRegular}; 
    paddingRight: 8;
`;

const MessageBubbleTextRight = styled.Text`
    color: ${COLORS.BLACK_COLOR};
    fontSize: ${FONT.TextSmallX};
    fontFamily: ${FONT_FAMILY.PoppinsRegular}; 
    paddingRight: 8;
`;

const MessageBubbleMediaMessage = styled(Image)`
    width:${wp(70)};
    height:${wp(70)};
    resizeMode: stretch;
`
const MessageBubbleReportMessage = styled.View`
    width:${wp(65)};
    height:${wp(20)};
    justifyContent: space-around;
    alignItems: center;
`
const PrescriptionTitleText = styled.Text`
    color: ${COLORS.BLACK_COLOR};
    fontSize: ${FONT.TextNormal};
    fontFamily: ${FONT_FAMILY.PoppinsRegular}; 
    paddingRight: 1;
`;
const PrescriptionText = styled.Text`
    color: ${COLORS.APP_THEME_COLOR};
    fontSize: ${FONT.TextNormal};
    fontFamily: ${FONT_FAMILY.PoppinsRegular}; 
    paddingRight: 1;
`;

const InputBox = styled.View`
flexDirection: row;
justifyContent: space-between;
paddingHorizontal: 20;
paddingVertical: 10;
backgroundColor: ${COLORS.INACTIVE_TOGGLE_COLOR};
`;

const AutoGrowInput = styled(AutogrowInput)`
fontSize: 16;
fontSize: ${FONT.TextNormal};
fontFamily: ${FONT_FAMILY.PoppinsRegular}; 
color: ${COLORS.BLACK_COLOR};
paddingHorizontal: 10;
`;

const SmallButton = styled.TouchableHighlight`
height: ${hp(3)}
width: ${wp(8)}
justifyContent: center;
alignItems: center;
marginLeft: 5;
`;


export {
    MainContainer,
    VerticalRowView,
    HorizontalRowView,
    RoundImageContainer,
    ChatContainer,
    BlueTextBox,
    CancelButton,
    TitleText,
    RBText,
    Seprator,
    WhiteText,
    NameText,
    BlueText,
    GreyText,
    BlueBoldText,
    GreyBoldText,
    TimeText,

    MessageBubbleLeft, MessageBubbleRight,
    MessageBubbleTextLeft, MessageBubbleTextRight,

    MessageBubbleMediaMessage, MessageBubbleReportMessage, PrescriptionTitleText, PrescriptionText,

    InputBox, AutoGrowInput, SmallButton,

}
