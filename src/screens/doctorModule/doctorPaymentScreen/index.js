import React from "react";
import { Header } from "react-native-elements"
import { View, TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";


import BaseClass from "../../../utils/BaseClass";
import { SafeAreaViewContainer, ScrollContainer, ShadowViewContainer } from "../../../utils/BaseStyles";
import COLORS from "../../../themes/Colors";
import {
    MainContainer, OptionText, DetailAreaContainer, SimpleRow, RegularText, RegularBlueText,
    CardsScrollView, CardBackground, AddIconButton, BoldBlueText, BoldText, ButtonContainer,
    CardNumberText, BalanceText, BalanceValueText, CardNameText, CardTypeText, SelectedMarkBG,
    DottedLine

} from "./styles";
import { Spacer } from "../../../components/spacer";
import STRINGS from "../../../utils/Strings";
import { FONT_FAMILY } from "../../../themes/FontFamilies";
import { FONT } from "../../../themes/FontSizes";
import { NewPrimaryButton } from "../../../components/buttons/primaryButton";
import Icon from "react-native-vector-icons/AntDesign";
import Icon2 from "react-native-vector-icons/Feather";
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
// import SearchBar from '../../../components/searchbarComponent';

const DummyCardList = [
    {
        cardNumber: "0610",
        cardType: "Debit Card",
        cardMake: "VISA",
        balance: "7,658"
    },
    {
        cardNumber: "4151",
        cardType: "Credit Card",
        cardMake: "Master",
        balance: "10,654"
    },
    {
        cardNumber: "1238",
        cardType: "Credit Card",
        cardMake: "American",
        balance: "15,469"
    },
    {
        cardNumber: "6541",
        cardType: "Debit Card",
        cardMake: "Swiss",
        balance: "469"
    },

];



export default class DoctorPaymentScreen extends BaseClass {

    constructor(props) {
        super(props);
        this.state = {
            isAnyCardSelected: false,
            selectCardIndex: -1,
            cardsList: DummyCardList,
            registrationCharges: 20,
            monthlyCharges: 30,
            agreeTC: false,
        }
    }

    onSubmitPress = () => {
        const { isAnyCardSelected, selectCardIndex, cardsList, registrationCharges, monthlyCharges } = this.state;

        if (isAnyCardSelected === false) {
            this.showToastAlert("Please select a card to complete payment");
        }
        else {
            this.showToastSucess(STRINGS.LOGIN_SUCCESSFUL);
        }

    };

    _renderHeader = () => {
        const { navigation } = this.props;
        return (
            <Header
                backgroundColor={COLORS.WHITE_COLOR}
                barStyle={"dark-content"}
                statusBarProps={{
                    translucent: true,
                }}
                leftComponent={(
                    <TouchableOpacity activeOpacity={1} delayPressIn={0}  style={{padding: 12}} onPress={() => navigation.pop()}>
                        <Icon name={'left'} size={wp(7)} />
                    </TouchableOpacity>
                )}
                centerComponent={{
                    text: STRINGS.PAYMENT_TEXT, style: {
                        color: COLORS.LIGHT_BLACK_COLOR,
                        fontSize: FONT.TextNormalX,
                        fontFamily: FONT_FAMILY.PoppinsSemiBold
                    }
                }}

                containerStyle={{
                    backgroundColor: COLORS.TRANSPARENT,
                    borderBottomColor: COLORS.TRANSPARENT,
                    paddingTop: 0,
                    height: 65,
                }}
            />
        )
    };

    renderItem = (card, index) => {
        const { selectCardIndex, isAnyCardSelected } = this.state;

        return <View>
            <CardBackground onPress={() => this.setState({ selectCardIndex: index })}>
                <CardTypeText >{card.cardType}</CardTypeText>
                <CardNumberText >**** {card.cardNumber}</CardNumberText>
                <BalanceText>{STRINGS.BALANCE_TEXT}</BalanceText>
                <BalanceValueText>{card.balance}</BalanceValueText>
                <CardNameText>{card.cardMake}</CardNameText>

                {selectCardIndex == index ? <SelectedMarkBG >
                    <IconMaterial name={'check-circle'} size={wp(7)} color={COLORS.APP_THEME_COLOR} />

                </SelectedMarkBG> : <View />}

            </CardBackground >
        </View>
    }

    render() {
        const { navigation } = this.props;
        const { cardsList, registrationCharges, monthlyCharges, agreeTC } = this.state;

        return (
            <SafeAreaViewContainer>
                {this._renderHeader()}
                <MainContainer>
                    <Spacer space={1} />
                    {/* <SearchBar onSearchPressed={(value) => console.error('search button pressed -- ', value)}
                        onTextChanged={(value) => console.warn(value)}
                    /> */}
                    <OptionText> {STRINGS.SELECT_PAYMENT_OPTION_TEXT}</OptionText>
                    <Spacer space={4} />
                    <CardsScrollView horizontal={true}
                        showsHorizontalScrollIndicator={false}>
                        <AddIconButton onPress={() => console.error('Pressed on Add Card ')} >
                            <Icon2 name={"plus"} size={30} color={COLORS.APP_THEME_COLOR} />
                        </AddIconButton>
                        {cardsList.map((card, index) => this.renderItem(card, index))}

                    </CardsScrollView>
                    <Spacer space={4} />
                    <ShadowViewContainer style={{ borderRadius: wp("8%") }}>
                        <DetailAreaContainer >
                            <SimpleRow >
                                <RegularText>{STRINGS.REGISTRATION_CHARGES_TEXT}</RegularText>
                                <RegularBlueText>${registrationCharges}</RegularBlueText>
                            </SimpleRow>

                            <Spacer space={1} />
                            <DottedLine />
                            <Spacer space={1} />
                            <SimpleRow >
                                <BoldText>{STRINGS.TOTAL_PRICE_TEXT}</BoldText>
                                <BoldBlueText>${registrationCharges + monthlyCharges}</BoldBlueText>
                            </SimpleRow>

                        </DetailAreaContainer>
                    </ShadowViewContainer>
                    <ButtonContainer>
                        <Spacer space={2} />
                        <SimpleRow >
                            <IconMaterial name={agreeTC ? 'check-box' : "check-box-outline-blank"} color={agreeTC ? COLORS.APP_THEME_COLOR : COLORS.BLACK_COLOR} size={20}
                                onPress={() => this.setState({ agreeTC: !agreeTC })} />
                            <Spacer row={1} />
                            <RegularText>{STRINGS.TERMS_AND_CONDITIONS_TEXT}</RegularText>
                        </SimpleRow>
                        <Spacer space={4} />
                        <ShadowViewContainer style={{ borderRadius: wp("8%") }}>
                            <NewPrimaryButton
                                btnText={STRINGS.SUBMIT_TEXT}
                                width={56}
                                borderRadius={wp("8%")}
                                verticalPaddingWithText={4}
                                isTextBold={true}
                                onPress={() => this.onSubmitPress()}
                            />
                        </ShadowViewContainer>
                    </ButtonContainer>
                </MainContainer>
            </SafeAreaViewContainer >
        )
    }
}
