import BaseClass from "../../../utils/BaseClass";
import {
  MainContainer,
  SafeAreaViewContainer,
} from "../../../utils/BaseStyles";
import COLORS from "../../../themes/Colors";
import React from "react";
import { Header, SearchBar, Overlay } from "react-native-elements";
import { FlatList, Image, View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Spacer } from "../../../components/spacer";
import { FONT_FAMILY } from "../../../themes/FontFamilies";
import { FONT } from "../../../themes/FontSizes";
import STRINGS from "../../../utils/Strings";
import AntDesign from "react-native-vector-icons/AntDesign";
import { WebView } from 'react-native-webview';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ImageViewer from "react-native-image-zoom-viewer";
import ImageZoom from 'react-native-image-pan-zoom';
import { MessageBubbleMediaMessage } from "../../doctorModule/consultationScreen/styles"
import Progress from 'react-native-progress/Circle';

class Preview extends BaseClass {
  constructor(props) {
    super(props);
    this.state = {
      uri: [{ height: wp(90), width: wp(100), url: this.props.route.params.url, props: {} }]
    };
    console.warn('url',this.props.route.params.url)
  }

  componentDidMount() {

  }


  _renderHeader = () => {
    const { navigation } = this.props;
    return (
      <Header
        backgroundColor={COLORS.WHITE_COLOR}
        barStyle={"dark-content"}
        statusBarProps={{
          translucent: true,
        }}
        leftComponent={
          <AntDesign
            name={"arrowleft"}
            color={COLORS.BLACK_COLOR}
            size={wp(6)}
            onPress={() => navigation.goBack()} />
        }
        centerComponent={{
          text: "Preview",
          style: {
            color: COLORS.LIGHT_BLACK_COLOR,
            fontSize: FONT.TextNormalX,
            fontFamily: FONT_FAMILY.PoppinsSemiBold,
          },
        }}
        containerStyle={{
          backgroundColor: COLORS.TRANSPARENT,
          borderBottomColor: COLORS.TRANSPARENT,
          paddingTop: 0,
          height: 60,
        }}
      />
    );
  };

  _renderPreview(path) {
    console.warn("path", path)
    return (
      <View style={{ flex: 1 }}>

      </View>
    )
  }

  render() {
    const { uri } = this.state;
    return (
      <SafeAreaViewContainer>
        {this._renderHeader()}
        <MainContainer style={{ justifyContent: "center" }}>
          <ImageZoom cropWidth={wp(100)}
            cropHeight={hp(85)}
            imageWidth={wp(100)}
            imageHeight={wp(110)}>
            <MessageBubbleMediaMessage style={{ width: wp(100), height: wp(110) }}
              indicator={Progress}
              source={{ uri: this.props.route.params.url }} />
          </ImageZoom>
        </MainContainer>
      </SafeAreaViewContainer>
    );
  }
}


export default Preview;
