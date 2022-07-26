import {widthPercentageToDP as wp,heightPercentageToDP as hp} from "react-native-responsive-screen";
import {Image, Text, View,ScrollView} from "react-native";
import {COMMON_IMAGES} from "../../utils/ImagePaths";
import {Spacer} from "../spacer";
import {FONT_FAMILY} from "../../themes/FontFamilies";
import COLORS from "../../themes/Colors";
import {FONT} from "../../themes/FontSizes";
import React from "react";

const NoDataFoundComponent = ({title}) => {
    return (
        <View style={{width: wp("90%"),height:hp('55%'), alignItems: "center"}}>
            <Image
                resizeMode={"contain"}
                source={COMMON_IMAGES.NO_ITEM_FOUND}
            />
            <Spacer space={2}/>
            <Text style={{
                width: wp("70%"),
                fontFamily: FONT_FAMILY.PoppinsRegular,
                textAlign: "center",
                color: COLORS.LIGHT_GREY_COLOR,
                fontSize: FONT.TextMedium
            }}>{title}</Text>
            <Spacer space={6}/>
        </View>
    )
}

export default NoDataFoundComponent
