import { createAsyncThunk } from "@reduxjs/toolkit";
import * as firebase from "firebase/app";

import { firebaseDB } from "helpers/firebase";
import { ProjectSubEntity } from "typings/entities";

const fetchSurveyAction = (projectId: string) => {
  return firebaseDB
    .collection("surveys")
    .where("projectId", "==", projectId)
    .get()
    .then((querySnapshot) => {
      const surveys: any = [];

      querySnapshot.forEach((document) => {
        surveys.push({
          ...document.data(),
          id: document.id,
        });
      });

      return surveys;
    });
};

export const fetchSurvey = createAsyncThunk("fetchSurvey", fetchSurveyAction);

const updateSurveyAction = (survey: any) => {
  return firebaseDB
    .collection("surveys")
    .doc(survey.id)
    .update({
      ...survey,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
};

export const updateSurvey = createAsyncThunk(
  "updateSurvey",
  updateSurveyAction
);

const createSurveyAction = (survey: any) => {
  const timestamp = firebase.firestore.FieldValue.serverTimestamp();

  return firebaseDB
    .collection("surveys")
    .add({
      ...survey,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .then((docRef) => {
      // TODO: use transaction
      firebaseDB
        .collection("projects")
        .doc(survey.projectId)
        .update({
          surveyId: docRef.id,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => console.log("success"))
        .catch((e) => {
          console.log(e);
        });

      return docRef.id;
    });
};

export const createSurvey = createAsyncThunk(
  "createSurvey",
  createSurveyAction
);

const deleteSurveyAction = ({ id }: ProjectSubEntity) =>
  firebaseDB.collection("surveys").doc(id).delete();

export const deleteSurvey = createAsyncThunk(
  "deleteSurvey",
  deleteSurveyAction
);
