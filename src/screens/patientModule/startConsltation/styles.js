import styled from 'styled-components/native'
import COLORS from "../../../themes/Colors";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import {FONT} from "../../../themes/FontSizes";
import {FONT_FAMILY} from "../../../themes/FontFamilies";
import {Dimensions} from "react-native";
const window = Dimensions.get('window');
import {StyleSheet} from 'react-native'

const SlideContainer = styled.View`
flex: 1;
justifyContent: center;
alignItems: center;
backgroundColor: ${COLORS.APP_BACKGROUND_COLOR}
`;

const ChooseUserTypeText = styled.Text`
width: ${wp("90%")};
textAlign: center;
color: ${COLORS.BLACK_COLOR};
fontFamily: ${FONT_FAMILY.MontserratSemiBold};
fontSize: ${FONT.TextLarge};
`;

const ChooseTypeDescriptionText = styled.Text`
width: ${wp("95%")};
color: ${COLORS.DARK_GREY_COLOR};
fontFamily: ${FONT_FAMILY.PoppinsRegular};
textAlign: center;
fontSize: ${FONT.TextNormalX};
`;

const GetStartedButtonView = styled.TouchableOpacity`
flexDirection: row;
alignItems: center;
paddingVertical: ${wp("3%")};
backgroundColor: ${COLORS.APP_THEME_COLOR};
width: ${wp("100%")};
paddingLeft: ${wp("15%")};
`;

const GetStartedText = styled.Text`
color: ${COLORS.WHITE_COLOR};
fontSize: ${FONT.TextMediumX};
fontFamily: ${FONT_FAMILY.MontserratSemiBold};
`;

const ActiveDotView = styled.View`
backgroundColor: ${COLORS.APP_THEME_COLOR};
width: 8;
height: 8;
borderRadius: 4;
marginLeft: 3;
marginRight: 3;
marginTop: 3;
marginBottom: 3;
`;

const InActiveDotView = styled.View`
backgroundColor: ${COLORS.DISABLE_APP_THEME_COLOR};
width: 8;
height: 8;
borderRadius: 4;
marginLeft: 3;
marginRight: 3;
marginTop: 3;
marginBottom: 3;
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
const VerticalRowView = styled.View`
 width: ${'100%'};
 flexDirection: row; 
`;
const styles = StyleSheet.create({
    
    container: {
      padding:0,
      margin:0,
      width:wp(95),
      alignSelf:'center'
      },
      headerContainer: {
        marginTop: 0,
        marginHorizontal: 0,
      },      
      svgCurve: {
        position: 'absolute',
        width: Dimensions.get('window').width
      },
})

export {
    SlideContainer,
    ChooseUserTypeText,
    ChooseTypeDescriptionText,
    GetStartedButtonView,
    GetStartedText,
    ActiveDotView,
    InActiveDotView,
    NameText,
    BlueText,
    GreyText,
    BlueBoldText,
    GreyBoldText,
    WhiteText,
    VerticalRowView,
    styles
}
