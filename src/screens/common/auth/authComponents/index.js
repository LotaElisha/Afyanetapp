import {AppIconImage, BackgroundContainer, BackgroundImage, Container, FillInfoText, TextInputHeading} from "./styles";
import {AUTH_IMAGES, COMMON_IMAGES, CONSULTATION_CHAT_IMAGES} from "../../../../utils/ImagePaths";
import React from "react";
import STRINGS from "../../../../utils/Strings";
import COLORS from "../../../../themes/Colors";
import {ImageBackground, View} from "react-native";

const CurvedImageBackground = () => {
    return (
        <Container>
            <BackgroundContainer>
                <BackgroundImage source={AUTH_IMAGES.AUTH_BACKGROUND_IMAGE}/>
            </BackgroundContainer>
        </Container>
    )
};


const ChatImageBackground = () => {
    return (
        <Container>
            <BackgroundContainer>
                <BackgroundImage source={CONSULTATION_CHAT_IMAGES.CONSULTATION_CHAT_BACKGROUND_IMAGE}/>
            </BackgroundContainer>
        </Container>
    )
};


const AppIconImageComponent = () => {
    return (
        <AppIconImage
            source={COMMON_IMAGES.APP_ICON_WITH_SHADOW}
        />
    )
};

const FillInfoTextComponent = () => {
    return (
        <FillInfoText>{STRINGS.FILL_BELOW_INFO_TEXT}</FillInfoText>
    )
};

const TextInputHeadingComponent = ({requireStar, title}) => {
    return (
        <View style={{zIndex: 0}}>
            {requireStar ?
                <TextInputHeading>{title}<TextInputHeading
                    style={{color: COLORS.FAILURE_TOAST_COLOR}}> *</TextInputHeading></TextInputHeading>
                :
                <TextInputHeading>{title}</TextInputHeading>
            }
        </View>
    )
};


export {
    CurvedImageBackground,
    ChatImageBackground,
    AppIconImageComponent,
    FillInfoTextComponent,
    TextInputHeadingComponent
}
