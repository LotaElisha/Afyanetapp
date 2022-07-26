import styled from 'styled-components/native'
import COLORS from "../../../themes/Colors";
import {FONT} from "../../../themes/FontSizes";
import {FONT_FAMILY} from "../../../themes/FontFamilies";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import {Dimensions} from "react-native";
const window = Dimensions.get('window');
import {StyleSheet} from 'react-native'

const Container = styled.View`
alignSelf: center;
width: ${window.width};
overflow: hidden;
height: ${wp(100) * 1.15};
`;

const BackgroundContainer = styled.View`
borderRadius: ${window.width};
width: ${wp(100) * 2};
height: ${wp(100) * 5};
marginLeft: ${-(wp(100) / 2)};
marginRight: ${-(wp(50) / 2)};
position: absolute;
bottom: 0;
overflow: hidden;
`;

const BackgroundImage = styled.Image`
width: ${wp(100)};
height: ${wp(100) * 1.15};
position: absolute;
bottom: 0;
marginLeft: ${wp(100) / 2};
`;

const AbsoluteContainer = styled.View`
alignItems: center;
`;

const SpecializationText = styled.Text`
color: ${COLORS.BLACK_COLOR};
fontSize: ${FONT.TextNormal};
fontFamily: ${FONT_FAMILY.MontserratSemiBold};
`;
const HorizontalRowView = styled.View`
 flexDirection: column; 
 paddingHorizontal:10;
`;

const DescriptionText = styled.Text`
color: ${COLORS.DARK_GREY_COLOR};
fontSize: ${FONT.TextSmallX};
fontFamily: ${FONT_FAMILY.PoppinsRegular};
textAlign: justify;
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
        marginTop: 0,
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
    Container,
    BackgroundImage,
    AbsoluteContainer,
    BackgroundContainer,
    SpecializationText,
    VerticalRowView,
    HorizontalRowView,
    BlueTextBox,
    WhiteText,
    NameText,
    BlueText,
    GreyText,
    BlueBoldText,
    GreyBoldText,
    DescriptionText,
    styles

}
