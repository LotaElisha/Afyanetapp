import React from "react";
import {View, Image} from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";

import styled from 'styled-components/native'
import COLORS from "../../themes/Colors";
import {FONT} from "../../themes/FontSizes";
import {FONT_FAMILY} from "../../themes/FontFamilies";
import {COMMON_IMAGES} from '../../utils/ImagePaths'

const SearchBar = ({space, row}) => {
    return (
        <Container>
            <InputText>
                Search..
            </InputText>
            <SearchButton>
                <Image style={{flex: 1}} source={COMMON_IMAGES.SEARCH_ICON} resizeMode={'contain'}/>
            </SearchButton>

        </Container>
    )
};

export default SearchBar;


const SearchButton = styled.TouchableOpacity`    
    justifyContent: center;
    alignItems: center;
    backgroundColor: ${COLORS.APP_THEME_COLOR};
    borderRadius: 30; 
    width: ${wp(20)}; 
    height: ${hp(7)};
    `;

const Container = styled.View`
    paddingLeft: 26;
    flexDirection: row;
    justifyContent: space-between;
    alignItems: center;
    paddingVertical: 1;
    backgroundColor: ${COLORS.WHITE_COLOR_SHADE};
    borderRadius: 30; 
    width: ${wp(76)}; 
    height: ${hp(6)};
    `;

const InputText = styled.TextInput`
    color: ${COLORS.PLACEHOLDERS_COLOR};
    fontSize: ${FONT.TextNormalX};
    fontFamily: ${FONT_FAMILY.PoppinsItalic};
`;

