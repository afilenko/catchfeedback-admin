import { createSlice } from '@reduxjs/toolkit'
import { SurveyDesign } from 'typings/entities'

import { fetchSurveyThemes, fetchSurveyTheme } from './actions'

type SurveysThemeState = {
  entities: Record<string, SurveyDesign>
}

const surveyThemes = createSlice({
  name: 'surveyThemes',
  initialState: { entities: {} as Record<string, SurveyDesign> },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSurveyThemes.fulfilled, (state: SurveysThemeState, { payload }: any) => {
      state.entities = payload as Record<string, SurveyDesign>
    })
    builder.addCase(
      fetchSurveyTheme.fulfilled,
      (state: SurveysThemeState, { payload, meta: { arg: surveyId } }: any) => {
        state.entities[surveyId] = payload as SurveyDesign
      },
    )
  },
})

export default surveyThemes
