import { API, BASE_URL } from "../constants";
import axios from "axios";
import { Platform } from "react-native";

export const UpdatePatientDatail = (
  payload,
  registerPatientDetailsResponse
) => {
  let data = new FormData();
  debugger
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
    data.append("first_name", payload.patient_first_name);
    data.append("patient_id", payload.id);
    data.append("last_name", payload.patient_last_name);
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

  let updateapi = BASE_URL + API.UPDATE_PATIENT_DETAIL;
  console.log("update api url is", updateapi);
  axios
    .post(updateapi, data, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + payload.token
      },
    })
    .then((response) => {
      registerPatientDetailsResponse(response.data);
    })
    .catch((error) => {
      registerPatientDetailsResponse(error);
    })
    .done();
};



export const RatingFeedback = (
  payload,
  ratingResponse
) => {
  debugger
  let data = new FormData();

  data.append("rated_by_user_id", payload.rated_by_user_id);
  data.append("rating_for", payload.rating_for);
  data.append("comment", payload.comment);
  data.append("rated_for_user_id", payload.rated_for_user_id);
  data.append("rating", payload.rating);
  data.append("request_id", payload.request_id);

  let updateapi = BASE_URL + API.SAVE_USER_RATING;
  console.log("update api url is", updateapi);
  axios
    .post(updateapi, data, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + payload.token
      },
    })
    .then((response) => {
      ratingResponse(response.data);
    })
    .catch((error) => {
      ratingResponse(error);
    })
    .done();
};
