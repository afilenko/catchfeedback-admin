import { AppState } from 'store/rootReducer'

export const surveyThemesSelector = ({ surveyThemes }: AppState) => surveyThemes.entities
