import { createAsyncThunk } from '@reduxjs/toolkit'
import * as firebase from 'firebase/app'

import { firebaseDB } from 'helpers/firebase'
import { Project } from 'typings/entities'

const fetchProjectsAction = () => {
  return firebaseDB
    .collection('projects')
    .orderBy('updatedAt', 'desc')
    .get()
    .then((querySnapshot) => {
      const projects: any = []

      querySnapshot.forEach((document) => {
        projects.push({
          ...document.data(),
          id: document.id,
        })
      })

      return projects
    })
}

export const fetchProjects = createAsyncThunk('projects/fetchProjects', fetchProjectsAction)

const fetchProjectAction = (projectId: string) =>
  firebaseDB
    .collection('projects')
    .doc(projectId)
    .get()
    .then((projectDoc) => {
      if (!projectDoc.exists) {
        return null
      }

      return projectDoc.data() as Project
    })

export const fetchProject = createAsyncThunk('projects/fetchProject', fetchProjectAction)

const updateProjectAction = (project: any) => {
  return firebaseDB
    .collection('projects')
    .doc(project.id)
    .update({
      ...project,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
}

export const updateProject = createAsyncThunk('projects/updateProject', updateProjectAction)

const createProjectAction = (project: any) => {
  const timestamp = firebase.firestore.FieldValue.serverTimestamp()
  const newProjectDocRef = firebaseDB.collection('projects').doc()
  const newSurveyDocRef = firebaseDB.collection('surveys').doc()
  const lightThemeDocRef = firebaseDB.collection('surveyThemes').doc('light')

  return firebaseDB.runTransaction(async (transaction) => {
    const lightThemeDoc = await transaction.get(lightThemeDocRef)
    const projectData = {
      ...project,
      createdAt: timestamp,
      updatedAt: timestamp,
      surveyId: newSurveyDocRef.id,
    }

    await transaction.set(newProjectDocRef, projectData)
    await transaction.set(newSurveyDocRef, {
      projectId: newProjectDocRef.id,
      design: lightThemeDoc.data(),
    })

    return Promise.resolve({ ...projectData, id: newProjectDocRef.id })
  })
}

export const createProject = createAsyncThunk('projects/createProject', createProjectAction)

const deleteProjectAction = (project: Project) => {
  return firebaseDB.runTransaction(async (transaction) => {
    await transaction.delete(firebaseDB.collection('projects').doc(project.id))
    await transaction.delete(firebaseDB.collection('surveys').doc(project.surveyId))

    return project
  })
}

export const deleteProject = createAsyncThunk('projects/deleteProject', deleteProjectAction)
