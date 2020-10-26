import { combineReducers } from 'redux'

import authSlice from './auth/slice'
import projectsSlice from './projects/slice'
import promotionsSlice from './promotions/slice'
import surveysSlice from './surveys/slice'
import surveyThemesSlice from './surveyThemes/slice'

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  projects: projectsSlice.reducer,
  promotions: promotionsSlice.reducer,
  surveys: surveysSlice.reducer,
  surveyThemes: surveyThemesSlice.reducer,
})

export default rootReducer

export type AppState = ReturnType<typeof rootReducer>
