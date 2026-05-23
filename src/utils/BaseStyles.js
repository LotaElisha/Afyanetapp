import styled from "styled-components";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context'
import COLORS from "../themes/Colors";

const MainContainer = styled.View`
flex: 1;
backgroundColor: ${COLORS.APP_BACKGROUND_COLOR};
alignItems: center;
`;
const ScrollContainer = styled(ScrollView).attrs(() => ({
    bounces: false
}))`
flex: 1;
backgroundColor:${COLORS.APP_BACKGROUND_COLOR};
`;

const ShadowViewContainer = styled.View`
 shadow-Color: ${COLORS.LIGHT_GREY_COLOR};
 shadow-Opacity: ${1};
 shadow-Radius: 3;
 shadow-Offset: 0px 2px;
 elevation: ${5};
 background-color: ${COLORS.TRANSPARENT}
`;


const BorderViewContainer = styled.View`
 borderColor:${COLORS.LIGHT_GREY_COLOR};
 borderWidth: 1 ;
 borderRadius:10;
 paddingVertical: ${wp("1%")};
`;

const SafeAreaViewContainer = styled(SafeAreaView).attrs(() => ({
    edges: ['top']
}))`
flex:1;
backgroundColor: ${COLORS.WHITE_COLOR};
`;

export {
    MainContainer,
    ScrollContainer,
    SafeAreaViewContainer,
    ShadowViewContainer,
    BorderViewContainer
}
