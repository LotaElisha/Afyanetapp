import { API, BASE_URL, DEVICE_TYPE } from "../constants";
import axios from "axios";
import { Platform } from "react-native";

//=====================COMMON REGISTER=====================//
export const RegisterApi = (payload, registerResponse) => {
  debugger;
  // data.append("user_type", payload.registerPayload.user_type);
  // data.append("first_name", payload.registerPayload.first_name);
  // data.append("last_name", payload.registerPayload.last_name);
  // data.append("email", payload.registerPayload.email);
  // data.append("phone_number", Number(payload.registerPayload.phone_number));
  // data.append("alternate_number", Number(payload.registerPayload.alternate_number));
  // data.append("password", payload.registerPayload.password);

  const body = {
    user_type: payload.registerPayload.user_type,
    first_name: payload.registerPayload.first_name,
    last_name: payload.registerPayload.last_name,
    email: payload.registerPayload.email,
    password: payload.registerPayload.password,
    phone_number: Number(payload.registerPayload.phone_number),
  };

  //temporary

  const RegisterUser = async (body) => {
    try {
      const response = await fetch(
        "https://dev.afyanetwork.com/api/v2/register",
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(body),
        }
      );
      const json = await response.json();

      console.log("trial1", json, body);
      registerResponse(json);
      return json;
    } catch (error) {
      console.log("trial2", error);
      registerResponse(error);
    }
  };

  RegisterUser(body);

  // axios
  //   .post("http://dev.afyanetwork.com/api/v2/register", data, {
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //   .then((response) => {
  //     console.log("first", response);
  //     registerResponse(response.data);
  //   })
  //   .catch((error) => {
  //     console.log("second", error, data);
  //     registerResponse(error);
  //   })
  //   .done();
};

//=====================REGISTER PATIENT DETAILS=====================//
export const RegisterPatientDetailsApi = (
  payload,
  registerPatientDetailsResponse
) => {
  let data = new FormData();
  debugger;
  let e1 = payload.emergency_contact1.slice(
    payload.emergency_contact1.lastIndexOf("+") + 1
  );
  let e2 = payload.emergency_contact2.slice(
    payload.emergency_contact2.lastIndexOf("+") + 1
  );
  console.warn("payload11", payload);
  data.append("id", payload.id);
  data.append("apply_for", payload.apply_for);

  if (payload.apply_for === "other") {
    data.append("patient_first_name", payload.patient_first_name);
    data.append("patient_last_name", payload.patient_last_name);
    data.append("relation", payload.relation);
    data.append("emergency_contact1", e1);
    data.append("emergency_contact2", e2.length < 12 ? "" : e2);
  }

  data.append("age", payload.age);
  data.append("blood_group", payload.blood_group);
  data.append("gender", payload.gender);
  data.append("is_diabetic", payload.is_diabetic);
  data.append("is_blood_pressure_problem", payload.is_blood_pressure_problem);
  data.append("is_smoking_habit", payload.is_smoking_habit);
  data.append("drug_history", payload.drug_history);
  data.append("post_diseases", payload.post_diseases);
  data.append("surgery_complication", payload.surgery_complication);

  axios
    .post(BASE_URL + API.REGISTER_PATIENT_DETAILS_API, data, {789214215
      headers: {},
    })
    .then((response) => {
      registerPatientDetailsResponse(response.data);
    })
    .catch((error) => {
      registerPatientDetailsResponse(error);
    })
    .done();
};

//=====================REGISTER DOCTOR DETAILS=====================//
export const RegisterDoctorDetailsApi = (
  payload,
  registerDoctorDetailsResponse
) => {
  let data = new FormData();
  debugger;
  data.append("id", payload.id);
  data.append("is_in_tern", payload.is_in_tern);
  data.append("specialization", payload.specialization);
  data.append("services_for", payload.services_for);
  data.append("certificate", {
    uri:
      Platform.OS === "ios"
        ? payload.certificate.path.replace("file://", "/private")
        : payload.certificate.path,
    name:
      payload.certificate.filename !== undefined &&
      payload.certificate.filename !== null
        ? payload.timestamp + "certificate" + payload.certificate.filename
        : payload.timestamp + "certificate" + ".JPEG",
    type: payload.certificate.mime,
  });

  data.append("image", {
    // uri: Platform.OS === 'android' ? `${payload.image.path}` : payload.image.path.replace("file://", "/private") ,
    uri:
      Platform.OS === "ios"
        ? payload.image.path.replace("file://", "/private")
        : payload.image.path,
    name:
      payload.image.filename !== undefined && payload.image.filename !== null
        ? payload.timestamp + "passport" + payload.image.filename
        : payload.timestamp + "passport" + ".JPEG",
    type: payload.image.mime,
  });
  if (payload.services_for.toLowerCase() === "internationals") {
    data.append("residential_permit", {
      uri:
        Platform.OS === "ios"
          ? payload.residential_permit.path.replace("file://", "/private")
          : payload.residential_permit.path,
      name:
        payload.residential_permit.filename !== undefined &&
        payload.residential_permit.filename !== null
          ? payload.timestamp +
            "residential_permit" +
            payload.residential_permit.filename
          : payload.timestamp + "residential_permit" + ".JPEG",
      type: payload.residential_permit.mime,
    });
    data.append("work_permit", {
      uri:
        Platform.OS === "ios"
          ? payload.work_permit.path.replace("file://", "/private")
          : payload.work_permit.path,
      name:
        payload.work_permit.filename !== undefined &&
        payload.work_permit.filename !== null
          ? payload.timestamp + "work_permit" + payload.work_permit.filename
          : payload.timestamp + "work_permit" + ".JPEG",
      type: payload.work_permit.mime,
    });
  }

  data.append("about_info", payload.about_info);
  data.append("qualification_details", payload.qualification_details);
  data.append("charge_by", payload.charge_by);
  data.append("charges", payload.charges);

  console.warn("payload", data);
  axios
    .post(BASE_URL + API.REGISTER_DOCTOR_DETAILS_API, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.warn("success", response.data);
      registerDoctorDetailsResponse(response.data);
    })
    .catch((error) => {
      console.warn("error", error);
      registerDoctorDetailsResponse(error);
    })
    .done();
};
