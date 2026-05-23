import React from "react";
import BaseClass from "../../../utils/BaseClass";
import {
  MainContainer,
  SafeAreaViewContainer,
  ScrollContainer,
  ShadowViewContainer,
} from "../../../utils/BaseStyles";
import COLORS from "../../../themes/Colors";
import { Spacer } from "../../../components/spacer";
import STRINGS from "../../../utils/Strings";
import * as Validations from "../../../utils/validations";
import { FONT_FAMILY } from "../../../themes/FontFamilies";
import { FONT } from "../../../themes/FontSizes";
import {
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
  Text,
  StatusBar,
  Image,
  FlatList,
  TextInput,
  Platform
} from "react-native";
import {
  AppIconImageComponent,
  FillInfoTextComponent,
} from "../../common/auth/authComponents";
import { AbsoluteContainer, CardContainerStyle, CardHeadingStyle } from "../../common/auth/authComponents/styles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  AUTH_IMAGES,
  DOCTOR_MODULE_IMAGES,
  DRAWER_ICONS,
} from "../../../utils/ImagePaths";
import {
  HorizontalRowView,
  RoundImageContainer,
  BlueTextBox,
  ChatContainer,
  CancelButton,
  WhiteText,
  NameText,
  BlueText,
  GreyText,
  BlueBoldText,
  GreyBoldText,
  VerticalRowView,
  SpecializationText,
  DescriptionText,
  styles,
} from "../consultationScreen/styles";
import { connect } from "react-redux";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Header } from "react-native-elements";
import { NewPrimaryButton } from "../../../components/buttons/primaryButton";
import { ListItemContainer } from "../commonStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DoctorDetailsApi } from "../../../redux/actions/DoctorDetailsAction";
import OrientationLoadingOverlay from "../../../utils/CustomLoader";
import DropDownPicker from "react-native-dropdown-picker";
import { Input } from "react-native-elements";
import { DaysList, HoursList } from "../../../utils/CommonStaticData";
import { MedicalSubmitApi } from "../../../redux/actions/PrescriptionAction";
import * as _ from "lodash";
import { getValueById } from "../../../utils/Helper";
import { BloodGroupOptionsData } from "../../../utils/CommonStaticData";

class MedicalPrescription extends BaseClass {
  constructor(props) {
    super(props);
    this.state = {
      doctorName: "",
      age: "",
      patientName: "",
      bloodGroup: "",
      charges: "",
      message: "",
      accessToken: "",
      medicineData: [
        {
          medicine_name: "",
          take_for: "",
          medicine_time: [],
          medicine_intake_type: "",
          note: "",
        },
      ],
      isLoading: false,
      consultationRequestId: this.props.route.params.request_Id,
      senderId: this.props.route.params.doctor_Id,
      receiverId: this.props.route.params.opponent_Id,
      patientId: this.props.route.params.patient_id,
      consultationDetails: this.props.route.params.data,
    };
    this.isVisible1 = false;
    this.controller1;
    this.isVisible2 = false;
    this.controller2;
    this.isVisible3 = false;
    this.controller3;
  }

  componentDidMount() {
    AsyncStorage.getItem(STRINGS.LOGIN_DATA).then((result) => {
      let userData = JSON.parse(result);
      if (userData !== undefined && userData !== null) {
        this.setState({ accessToken: userData.token });
      }
    });
  }

  HandleSubmitResponse = (response) => {
    debugger;
    const { navigation } = this.props;
    const { navigate } = navigation;
    if (response !== undefined && response !== null) {
      if (response.code === 200) {
        this.hideDialog();
        if (
          response.data !== undefined &&
          response.data !== null &&
          response.data.length !== 0
        ) {
          console.log(response.data);
          navigate("ConsultationChatScreen", {
            comingFrom: "Uploads",
            id: response.data.prescription_id,
            type: 3,
          });
        }
      } else if (response.code === 204) {
        this.hideDialog();
        this.showToastAlert(response.message);
      } else if (response.code === 400) {
        this.hideDialog();
        this.showToastAlert(response.message);
      } else if (response.code === 401) {
        this.hideDialog();
        this.showToastAlert(response.message);
      } else if (response.code === 500) {
        this.hideDialog();
        this.showToastAlert(STRINGS.SERVER_ERROR);
      } else {
        this.hideDialog();
        this.showToastAlert(STRINGS.UNKNOWN_ERROR);
      }
    } else {
      this.hideDialog();
      this.showToastAlert(STRINGS.UNKNOWN_ERROR);
    }
  };

  setMedicineName = (type, text, index) => {
    const { medicineData } = this.state;
    switch (type) {
      case "medicineName":
        _.map(medicineData, (item, index1) => {
          if (index === index1) {
            medicineData[index].medicine_name = text;
          }
        });
        this.setState({
          medicineData,
        });
        break;
      case "medicineNote":
        _.map(medicineData, (item, index1) => {
          if (index === index1) {
            medicineData[index].note = text;
          }
        });
        this.setState({
          medicineData,
        });
        break;
    }
  };
  setDropDownItem = (type, itemdata, index) => {
    const { medicineData } = this.state;
    switch (type) {
      case "TakeFor":
        _.map(medicineData, (item, index1) => {
          if (index === index1) {
            medicineData[index].take_for = itemdata.value;
          }
        });
        this.setState({
          medicineData,
        });
      case "Attime":
        _.map(medicineData, (item, index1) => {
          if (index === index1) {
            medicineData[index].medicine_time = JSON.stringify(itemdata);
          }
        });
        this.setState({
          medicineData,
        });
        break;
      case "IntakeType":
        _.map(medicineData, (item, index1) => {
          if (index === index1) {
            medicineData[index].medicine_intake_type = itemdata.label;
          }
        });
        this.setState({
          medicineData,
        });
        break;
    }
  };

  onSubmitPress = () => {
    const { navigation } = this.props;
    const { navigate } = navigation;
    const {
      medicineData,
      accessToken,
      senderId,
      consultationRequestId,
      receiverId,
      patientId,
    } = this.state;

    console.log("length is", medicineData.length);

    _.map(medicineData, (item, index) => {

      if (medicineData[index].medicine_name.length === 0) {
        this.showToastAlert(STRINGS.EMPTY_MEDICINE_NAME + "at index " + index);
        return
      } else if (medicineData[index].take_for.length === 0) {
        this.showToastAlert(STRINGS.EMPTY_TAKE_FOR_TIME + "at index " + index);
        return
      } else if (medicineData[index].medicine_time.length === undefined) {
        this.showToastAlert(STRINGS.EMPTY_AT_TIME + "at index " + index);
        return
      } else if (medicineData[index].medicine_intake_type.length === 0) {
        this.showToastAlert(STRINGS.EMPTY_INTAKE_TYPE + "at index " + index);
        return
      }
      else {
        console.log("index", index)
        console.log("index", medicineData.length)
        if (index === medicineData.length - 1) {
          console.log("api hit hogi")
          if (this.isConnected()) {

            this.showDialog();
            MedicalSubmitApi(
              {
                token: accessToken,
                doctor_id: senderId,
                caretaker_id: receiverId,
                test_name: medicineData,
                request_id: consultationRequestId,
                patient_id: patientId,
              },
              (response) => this.HandleSubmitResponse(response)
            );
          }
        }
      }
    });


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
        leftComponent={
          <AntDesign
            name={"arrowleft"}
            color={COLORS.BLACK_COLOR}
            size={wp(7)}
            onPress={() => navigation.goBack()}
          />
        }
        centerComponent={{
          text: STRINGS.MEDICAL_PRESCRIPTION_TITLE_TEXT,
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

  _renderCustomLoader = () => {
    const { isLoading } = this.state;
    return (
      <OrientationLoadingOverlay visible={isLoading} message="Loading.." />
    );
  };

  _renderItem = (item, index) => {
    const { selectedTime, intakeType, medicineNote, medicineData } = this.state;
    return (
      <View
        style={{
          width: wp("90%"),
          paddingVertical: wp("3.5%"),
          paddingHorizontal: wp("2%"),
          alignItems: "center",
          backgroundColor: COLORS.WHITE_COLOR_SHADE,
          marginBottom: wp("4%"),
          borderRadius: wp("3%"),
        }}
      >
        <Text
          style={{
            color: COLORS.BLACK_COLOR,
            fontSize: FONT.TextNormalX,
            fontFamily: FONT_FAMILY.PoppinsRegular,
            width: wp("85%"),
          }}
        >
          {STRINGS.MEDICAL_PRESCRIPTION_MEDICINE_NAME}
        </Text>
        <Input
          inputContainerStyle={{
            borderBottomColor: "#DDE7E6",
            borderBottomWidth: 2,
            alignItems: "center",
            width: wp("76%"),
          }}
          placeholder={STRINGS.MEDICAL_PRESCRIPTION_MEDICINE_NAME}
          placeholderTextColor={COLORS.PLACEHOLDERS_COLOR}
          ref="medicine"
          value={medicineData[index].medicine_name}
          autoCapitalize="none"
          onChangeText={(text) =>
            this.setMedicineName("medicineName", text, index)
          }
          returnKeyType={"next"}
          inputStyle={{
            color: COLORS.GREY_COLOR,
            fontSize: FONT.TextNormal,
            fontFamily: FONT_FAMILY.MontserratRegular,
          }}
        />
        <Text
          style={{
            color: COLORS.BLACK_COLOR,
            fontSize: FONT.TextNormalX,
            fontFamily: FONT_FAMILY.PoppinsRegular,
            width: wp("85%"),
          }}
        >
          {"Take For"}
        </Text>
        <View
          style={{
            ...(Platform.OS !== "android" && {
              zIndex: 10,
            }),
          }}
        >
          <DropDownPicker
            items={DaysList}
            controller={(instance) => (this.controller1 = instance)}
            defaultValue={""}
            onOpen={() => (this.isVisible1 = true)}
            onClose={() => (this.isVisible1 = false)}
            containerStyle={{ width: wp("76%") }}
            style={{
              backgroundColor: 'transparent',
              paddingLeft: 0,
              paddingRight: wp("1%"),
              paddingBottom: wp("2.5%"),
              paddingTop: wp("3.5%"),
              borderWidth: 0,
              borderBottomColor: "#DDE7E6",
              borderBottomWidth: 2,
            }}
            itemStyle={{
              justifyContent: "flex-start",
              backgroundColor: COLORS.WHITE_COLOR
            }}
            labelStyle={{
              color: COLORS.GREY_COLOR,
              fontSize: FONT.TextNormal,
              fontFamily: FONT_FAMILY.MontserratRegular,
            }}
            placeholder={"Select days"}
            dropDownStyle={{ backgroundColor: COLORS.WHITE_COLOR }}
            onChangeItem={(item) => {
              this.isVisible1 = false;
              this.setDropDownItem("TakeFor", item, index);
            }}
            selectedLabelStyle={{
              color: COLORS.GREY_COLOR,
              fontSize: FONT.TextNormal,
              fontFamily: FONT_FAMILY.MontserratRegular,
            }}
            activeLabelStyle={{ color: COLORS.APP_THEME_COLOR }}
            customArrowUp={() => (
              <Image
                source={AUTH_IMAGES.DROP_DOWN_ICON}
                resizeMode={"contain"}
              />
            )}
            customArrowDown={() => (
              <Image
                source={AUTH_IMAGES.DROP_DOWN_ICON}
                resizeMode={"contain"}
              />
            )}
          />
        </View>
        <Spacer space={2} />
        <Text
          style={{
            color: COLORS.BLACK_COLOR,
            fontSize: FONT.TextNormalX,
            fontFamily: FONT_FAMILY.PoppinsRegular,
            width: wp("85%"),
          }}
        >
          {"At time"}
        </Text>
        <View
          style={{
            ...(Platform.OS !== "android" && {
              zIndex: 8,
            }),
          }}
        >
          <DropDownPicker
            items={HoursList}
            controller={(instance) => (this.controller2 = instance)}
            defaultValue={""}
            multiple={true}
            onOpen={() => (this.isVisible2 = true)}
            onClose={() => (this.isVisible2 = false)}
            containerStyle={{ width: wp("76%") }}
            style={{
              backgroundColor: "transparent",
              paddingLeft: 0,
              paddingRight: wp("1%"),
              paddingBottom: wp("2.5%"),
              paddingTop: wp("3.5%"),
              borderWidth: 0,
              borderBottomColor: "#DDE7E6",
              borderBottomWidth: 2,
            }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            labelStyle={{
              color: COLORS.GREY_COLOR,
              fontSize: FONT.TextNormal,
              fontFamily: FONT_FAMILY.MontserratRegular,
            }}
            placeholder={"Select time"}
            dropDownStyle={{ backgroundColor: COLORS.WHITE_COLOR }}
            onChangeItem={(item) => {
              this.isVisible2 = false;
              this.setDropDownItem("Attime", item, index);
            }}
            selectedLabelStyle={{
              color: COLORS.GREY_COLOR,
              fontSize: FONT.TextNormal,
              fontFamily: FONT_FAMILY.MontserratRegular,
            }}
            activeLabelStyle={{ color: COLORS.APP_THEME_COLOR }}
            customArrowUp={() => (
              <Image
                source={AUTH_IMAGES.DROP_DOWN_ICON}
                resizeMode={"contain"}
              />
            )}
            customArrowDown={() => (
              <Image
                source={AUTH_IMAGES.DROP_DOWN_ICON}
                resizeMode={"contain"}
              />
            )}
          />
        </View>
        <Spacer space={2} />

        <Text
          style={{
            color: COLORS.BLACK_COLOR,
            fontSize: FONT.TextNormalX,
            fontFamily: FONT_FAMILY.PoppinsRegular,
            width: wp("85%"),
          }}
        >
          {STRINGS.MEDICAL_PRESCRIPTION_INTAKE_TEXT}
        </Text>
        <View
          style={{
            ...(Platform.OS !== "android" && {
              zIndex: 6,
            }),
          }}
        >
          <DropDownPicker
            items={[
              { label: "Before Meal", value: "1" },
              { label: "After Meal", value: "2" },
            ]}
            controller={(instance) => (this.controller3 = instance)}
            defaultValue={""}
            onOpen={() => (this.isVisible3 = true)}
            onClose={() => (this.isVisible3 = false)}
            containerStyle={{
              width: wp("76%"),
            }}
            style={{
              backgroundColor: "transparent",
              paddingLeft: 0,
              paddingRight: wp("1%"),
              paddingBottom: wp("2.5%"),
              paddingTop: wp("3.5%"),
              borderWidth: 0,
              borderBottomColor: "#DDE7E6",
              borderBottomWidth: 2,
            }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            labelStyle={{
              color: COLORS.GREY_COLOR,
              fontSize: FONT.TextNormal,
              fontFamily: FONT_FAMILY.MontserratRegular,
            }}
            placeholder={"Select"}
            dropDownStyle={{ backgroundColor: COLORS.WHITE_COLOR }}
            onChangeItem={(item) => {
              this.isVisible3 = false;
              this.setDropDownItem("IntakeType", item, index);
            }}
            selectedLabelStyle={{
              color: COLORS.GREY_COLOR,
              fontSize: FONT.TextNormal,
              fontFamily: FONT_FAMILY.MontserratRegular,
            }}
            activeLabelStyle={{ color: COLORS.APP_THEME_COLOR }}
            customArrowUp={() => (
              <Image
                source={AUTH_IMAGES.DROP_DOWN_ICON}
                resizeMode={"contain"}
              />
            )}
            customArrowDown={() => (
              <Image
                source={AUTH_IMAGES.DROP_DOWN_ICON}
                resizeMode={"contain"}
              />
            )}
          />
        </View>
        <Spacer space={2} />
        <Text
          style={{
            color: COLORS.BLACK_COLOR,
            fontSize: FONT.TextNormalX,
            fontFamily: FONT_FAMILY.PoppinsRegular,
            width: wp("85%"),
          }}
        >
          {"Note on medicine"}
        </Text>
        <Spacer space={2} />
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderColor: COLORS.GREY_BORDER_COLOR,
            borderWidth: 2,
            borderRadius: 10,
            width: wp(76),
            height: hp(18),
          }}
        >
          <TextInput
            style={{
              flex: 1,
              color: COLORS.GREY_COLOR,
              fontSize: FONT.TextNormal,
              fontFamily: FONT_FAMILY.MontserratRegular,
            }}
            multiline
            maxLength={200}
            scrollEnabled={false}
            textAlignVertical={"top"}
            placeholder="About Medicine"
            numberOfLines={4}
            placeholderTextColor={COLORS.PLACEHOLDERS_COLOR}
            value={medicineData[index].note}
            autoCapitalize="none"
            onChangeText={(text) =>
              this.setMedicineName("medicineNote", text, index)
            }
          />
        </View>
      </View>
    );
  };

  AddMorePress() {
    const { medicineData } = this.state;
    _.map(medicineData, (item, index) => {
      console.log("medicineData-----", medicineData[index]);
      if (medicineData[index].medicine_name.length === 0) {
        this.showToastAlert(STRINGS.EMPTY_MEDICINE_NAME + "at index " + index);
      } else if (medicineData[index].take_for.length === 0) {
        this.showToastAlert(STRINGS.EMPTY_TAKE_FOR_TIME + "at index " + index);
      } else if (medicineData[index].medicine_time.length === undefined) {
        this.showToastAlert(STRINGS.EMPTY_AT_TIME + "at index " + index);
      } else if (medicineData[index].medicine_intake_type.length === 0) {
        this.showToastAlert(STRINGS.EMPTY_INTAKE_TYPE + "at index " + index);
      } else {
        if (medicineData.length - 1 == index) {
          let medicineDetail = {
            medicine_name: "",
            take_for: "",
            medicine_time: [],
            medicine_intake_type: "",
            note: "",
          };
          medicineData.push(medicineDetail);
          this.setState({
            medicineData: medicineData,
          });
        }
      }
    });
  }

  render() {
    const { navigation } = this.props;
    const {
      consultationDetails,
      medicineData,
    } = this.state;
    let patient_image = consultationDetails.care_taker_data.profile_image_path != null ? consultationDetails.care_taker_data.profile_image_path : ''

    return (
      <SafeAreaViewContainer style={{ backgroundColor: "transparent" }}>
        {this._renderHeader()}
        <ScrollContainer keyboardShouldPersistTaps={"handled"}
        >
          <MainContainer
            onTouchEnd={() => {
              if (this.isVisible1 === true) {
                this.controller1.close();
              }
              if (this.isVisible2 === true) {
                this.controller2.close();
              }
              if (this.isVisible3 === true) {
                this.controller3.close();
              }
            }}
          >
            <VerticalRowView>
              <RoundImageContainer>
                <Image
                  style={{ resizeMode: 'cover', height: wp(20), width: wp(20), borderRadius: wp(10) }}
                  source={patient_image !== "" ? { uri: patient_image } : DOCTOR_MODULE_IMAGES.DUMMY_DOCTOR_PICTURE} />
              </RoundImageContainer>

              <HorizontalRowView style={{ justifyContent: 'flex-start' }}>
                <NameText
                  style={{ textAlign: 'left' }}>{consultationDetails.care_taker_data.name}</NameText>
                <BlueText>Blood Group: {getValueById(BloodGroupOptionsData, consultationDetails.patient_detail_data.blood_group)}</BlueText>
                <GreyText>Age: {consultationDetails.patient_detail_data.age} Years</GreyText>
                <VerticalRowView>
                  <Ionicons name={'location-sharp'} size={22} color={'#EE3840'} />
                  <GreyText>{consultationDetails.distance + ' Away'}</GreyText>
                  <Spacer row={5} />
                  <BlueBoldText>{consultationDetails.charges !== "" && consultationDetails.charges !== null ? `$ ${consultationDetails.charges}` : ""}</BlueBoldText>
                </VerticalRowView>
              </HorizontalRowView>
            </VerticalRowView>
            <Spacer space={1.5} />
            {consultationDetails.care_taker_data.user_type == "caretaker" &&
              <NewPrimaryButton
                color={COLORS.APP_THEME_COLOR}
                btnText={`Caretaker - ${consultationDetails.care_taker_data.name}`}
                width={46}
                textSize={FONT.TextSmall}
                verticalPaddingWithText={2.2}
                borderRadius={wp("1.6%")}
                fontFamily={FONT_FAMILY.PoppinsSemiBold}
              />
            }
            {consultationDetails.care_taker_data.user_type == "caretaker" &&
              <Spacer space={1.5} />
            }
            <Spacer space={2} />
            <NameText style={{ textAlign: "left", width: wp("90%") }}>
              {STRINGS.MEDICAL_PRESCRIPTION_TEXT}
            </NameText>
            <Spacer space={2} />
            {/* <FlatList
              showsVerticalScrollIndicator={false}
              data={medicineData}
              renderItem={({ item, index }) => this._renderItem(item, index)}
              scrollEnabled={false}
            /> */}
            {
              medicineData.map((item, index) => {
                return (
                  this._renderItem(item, index)
                )

              })
            }
            <Spacer space={2} />
            <View
              style={{
                justifyContent: "flex-end",
                alignItems: "flex-end",
                width: wp("90%"),
              }}
            >
              <NewPrimaryButton
                color={COLORS.APP_THEME_COLOR}
                btnText={STRINGS.MEDICAL_PRESCRIPTION_ADD_MORE}
                width={18}
                textSize={FONT.TextSmall}
                verticalPaddingWithText={2.2}
                borderRadius={wp("1.6%")}
                onPress={() => this.AddMorePress()}
                fontFamily={FONT_FAMILY.PoppinsSemiBold}
              />
            </View>
            <Spacer space={2} />
            <NewPrimaryButton
              color={COLORS.APP_THEME_COLOR}
              btnText={"SUBMIT"}
              width={45}
              textSize={FONT.TextMedium}
              verticalPaddingWithText={2.2}
              borderRadius={wp("8%")}
              onPress={() => this.onSubmitPress()}
              fontFamily={FONT_FAMILY.PoppinsSemiBold}
            />
            <Spacer space={2} />
          </MainContainer>
          {this._renderCustomLoader()}
        </ScrollContainer >
      </SafeAreaViewContainer >
    );
  }
}

export default MedicalPrescription;
