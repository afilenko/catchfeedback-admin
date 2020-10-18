import { createAsyncThunk } from "@reduxjs/toolkit";
import * as firebase from "firebase/app";

import { firebaseDB } from "helpers/firebase";
import { Project } from "typings/entities";

const fetchProjectsAction = () => {
  return firebaseDB
    .collection("projects")
    .orderBy("updatedAt", "desc")
    .get()
    .then((querySnapshot) => {
      const projects: any = [];

      querySnapshot.forEach((document) => {
        projects.push({
          ...document.data(),
          id: document.id,
        });
      });

      return projects;
    });
};

export const fetchProjects = createAsyncThunk(
  "fetchProjects",
  fetchProjectsAction
);

const fetchProjectAction = (projectId: string) =>
  firebaseDB
    .collection("projects")
    .doc(projectId)
    .get()
    .then((projectDoc) => {
      if (!projectDoc.exists) {
        return null;
      }

      return projectDoc.data() as Project;
    });

export const fetchProject = createAsyncThunk(
  "fetchProject",
  fetchProjectAction
);

const updateProjectAction = (project: any) => {
  return firebaseDB
    .collection("projects")
    .doc(project.id)
    .update({
      ...project,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
};

export const updateProject = createAsyncThunk(
  "updateProject",
  updateProjectAction
);

const createProjectAction = (project: any) => {
  const timestamp = firebase.firestore.FieldValue.serverTimestamp();
  const newProjectDocRef = firebaseDB.collection("projects").doc();
  const newSurveyDocRef = firebaseDB.collection("surveys").doc();

  return firebaseDB.runTransaction(async (transaction) => {
    await transaction.set(newProjectDocRef, {
      ...project,
      createdAt: timestamp,
      updatedAt: timestamp,
      surveyId: newSurveyDocRef.id,
    });

    await transaction.set(newSurveyDocRef, { projectId: newProjectDocRef.id });

    return Promise.resolve(newProjectDocRef.id);
  });
};

export const createProject = createAsyncThunk(
  "createProject",
  createProjectAction
);

const deleteProjectAction = (projectId: string) =>
  firebaseDB.collection("projects").doc(projectId).delete();

export const deleteProject = createAsyncThunk(
  "deleteProject",
  deleteProjectAction
);
