import { createAsyncThunk, createAction } from '@reduxjs/toolkit'
import * as firebase from 'firebase/app'
import { THEME_NAMES } from 'helpers/constants'

import { firebaseDB } from 'helpers/firebase'

const fetchSurveyAction = (projectId: string) => {
  return firebaseDB
    .collection('surveys')
    .where('projectId', '==', projectId)
    .get()
    .then((querySnapshot) => {
      const surveys: any = []

      querySnapshot.forEach((document) => {
        surveys.push({
          ...document.data(),
          id: document.id,
        })
      })

      return surveys
    })
}

export const fetchSurvey = createAsyncThunk('surveys/fetchSurvey', fetchSurveyAction)

const updateSurveyAction = async (survey: any) => {
  if (survey.design?.theme === THEME_NAMES.CUSTOM) {
    const customThemeDocRef = firebaseDB.collection('surveyThemes').doc(survey.id)
    const customThemeDoc = await customThemeDocRef.get()

    if (!customThemeDoc.exists) {
      customThemeDocRef.set(survey.design)
      // customThemeDocRef.set({...survey.design, theme: 'custom'})
    } else {
      customThemeDocRef.update(survey.design)
    }
  }

  return firebaseDB
    .collection('surveys')
    .doc(survey.id)
    .update({
      ...survey,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
}

export const updateSurvey = createAsyncThunk('surveys/updateSurvey', updateSurveyAction)

export const setSurveyLocale = createAction('surveys/setSurveyLocale', (locale: string) => ({
  payload: locale,
}))
