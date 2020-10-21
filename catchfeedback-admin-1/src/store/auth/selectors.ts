import { AppState } from 'store/rootReducer'

export const authUserSelector = ({ auth }: AppState) => auth.user
