import { AppState } from "store/rootReducer";

export const surveysSelector = ({ surveys }: AppState) => surveys.entities;
export const isPendingSurveysSelector = ({ surveys }: AppState) =>
  surveys.pending;
