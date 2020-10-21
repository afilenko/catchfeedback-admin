import { AppState } from 'store/rootReducer'

export const projectsSelector = ({ projects }: AppState) => projects.entities
export const isPendingProjectsSelector = ({ projects }: AppState) => projects.pending
