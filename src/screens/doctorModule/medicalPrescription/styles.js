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

const styles = StyleSheet.create({    
      headerContainer: {
        marginTop: 0,
        marginHorizontal: 0,
      },
})

export {
    Container,    
    styles

}
