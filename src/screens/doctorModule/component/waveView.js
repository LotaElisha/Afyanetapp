import React from 'react';
import { View, ImageBackground,Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import {  DOCTOR_MODULE_IMAGES } from "../../../utils/ImagePaths";
import COLORS from "../../../themes/Colors";

export default function WavyHeader({
  customStyles,
  customHeight,
  customTop,
  customBgColor,
  customWavePattern,
  imgSource
}) {
  return (
    <ImageBackground
      source={imgSource}
      style={customStyles}
      style={{
        // backgroundColor: customBgColor,
        height: customHeight
      }}
    >
      <Svg
        height="60%"
        width="100%"
        viewBox="0 0 1440 320"
        style={{ position: 'absolute', top: customTop }}
      >
        <Path 
        fill={customBgColor} 
        d={customWavePattern} />
      </Svg>
      <View style={{padding:wp(1),margin:wp(1.5),alignItems:'center',borderRadius:wp(3.5),height:wp(7),width:wp(25),backgroundColor:COLORS.LIGHT_GREY_COLOR}}>
        <Image
          source={DOCTOR_MODULE_IMAGES.ACTIVE_STATUS_ICON}
          style={{height:wp(5),width:wp(20),resizeMode:'contain'}}
           />
      </View>
    </ImageBackground>
  );
}