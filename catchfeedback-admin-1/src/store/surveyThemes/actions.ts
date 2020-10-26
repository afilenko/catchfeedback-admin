import { createAsyncThunk } from '@reduxjs/toolkit'

import { firebaseDB } from 'helpers/firebase'
import { THEMES } from 'helpers/constants'

const fetchSurveyThemesAction = () =>
  Promise.all(
    THEMES.map((themeName) => firebaseDB.collection('surveyThemes').doc(themeName).get()),
  ).then((themeDocs) =>
    themeDocs.reduce((themes, doc) => {
      if (doc.exists) {
        const themeData = doc.data()

        return themeData
          ? {
              ...themes,
              [themeData.theme]: themeData,
            }
          : themes
      } else {
        return themes
      }
    }, {}),
  )

export const fetchSurveyThemes = createAsyncThunk(
  'surveyThemes/fetchSurveyThemes',
  fetchSurveyThemesAction,
)

const fetchSurveyThemeAction = async (surveyId: string) => {
  const lightTheme = await firebaseDB.collection('surveyThemes').doc(surveyId).get()
  return lightTheme.data()
}

export const fetchSurveyTheme = createAsyncThunk(
  'surveyThemes/fetchSurveyTheme',
  fetchSurveyThemeAction,
)
