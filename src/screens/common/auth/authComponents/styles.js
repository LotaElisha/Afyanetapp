import {Dimensions} from "react-native";
import styled from 'styled-components/native'
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import COLORS from "../../../../themes/Colors";
import {FONT} from "../../../../themes/FontSizes";
import {FONT_FAMILY} from "../../../../themes/FontFamilies";

const window = Dimensions.get('window');

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
backgroundColor: ${COLORS.APP_BACKGROUND_COLOR};
`;

const AbsoluteContainer = styled.View`
alignItems: center;
marginTop: ${-wp("110%")};
`;

const AppIconImage = styled.Image`
height: ${wp("25%")};
width: ${wp("25%")};
`;

const FillInfoText = styled.Text`
color: ${COLORS.WHITE_COLOR};
fontSize: ${FONT.TextSmallX};
fontFamily: ${FONT_FAMILY.PoppinsRegular}
`;

const CardContainerStyle = styled.View`
width: ${wp("86%")};
backgroundColor: ${COLORS.WHITE_COLOR};
paddingVertical: ${wp("5%")};
paddingHorizontal: ${wp("3%")};
alignItems: center;
borderRadius: ${wp("8%")}
`;

const CardHeadingStyle = styled.Text`
color: ${COLORS.BLACK_COLOR};
fontSize: ${FONT.TextMedium};
fontFamily: ${FONT_FAMILY.PoppinsRegular};
fontWeight: bold;
`;

const TextInputHeading = styled.Text`
color: ${COLORS.BLACK_COLOR};
fontSize: ${FONT.TextNormalX};
fontFamily: ${FONT_FAMILY.PoppinsSemiBold};
width: ${wp("76%")};
`;

const CommentHeading = styled.Text`
color: ${COLORS.BLACK_COLOR};
fontSize: ${FONT.TextSmallX};
width: ${wp("76%")};
alignSelf: center;
`;

export {
    Container,
    BackgroundContainer,
    BackgroundImage,
    AbsoluteContainer,
    AppIconImage,
    FillInfoText,
    CardContainerStyle,
    CardHeadingStyle,
    TextInputHeading,
    CommentHeading
}
