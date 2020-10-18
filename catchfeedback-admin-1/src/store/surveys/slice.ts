import { createSlice } from "@reduxjs/toolkit";
import { ROUTES } from "helpers/config";

import { ProjectSubEntity, Survey } from "typings/entities";
import {
  fetchSurvey,
  createSurvey,
  updateSurvey,
  deleteSurvey,
} from "./actions";

export type ArgumentsOfSaveOrderItemAction = {
  orderId: number;
  productId: number;
  checked: boolean;
};

type SurveysState = {
  entities: Survey[];
  error: any;
  pending: boolean;
};

type NewSurveyResponse = {
  payload: string;
  meta: { arg: Survey };
};

const surveys = createSlice({
  name: "surveys",
  initialState: { entities: [], error: null, pending: false } as SurveysState,
  reducers: {
    clearSurveysState() {
      return { entities: [], pending: false, error: null };
    },
  },
  extraReducers: (builder) => {
    const pendingReducer = (state: SurveysState) => {
      state.pending = true;
      state.error = null;
    };
    const errorReducer = (state: SurveysState) => {
      state.pending = false;
      // TODO: add specific details from the args/payload if needed
      state.error = "Something went wrong";
    };

    // fetch
    builder.addCase(fetchSurvey.fulfilled, (state, { payload }) => {
      const survey = payload && payload[0];
      if (survey) {
        state.entities.push(survey);
      }

      state.pending = false;
      state.error = null;
    });
    builder.addCase(fetchSurvey.pending, pendingReducer);
    builder.addCase(fetchSurvey.rejected, errorReducer);

    // update
    builder.addCase(
      updateSurvey.fulfilled,
      (state, { meta }: { meta: { arg: Survey } }) => {
        const { arg } = meta;

        state.pending = false;

        if (!arg) {
          return;
        }

        let updatedEntity = state.entities.find(({ id }) => id === arg.id);

        if (!updatedEntity) {
          return;
        }

        for (const [key, value] of Object.entries(arg)) {
          if (updatedEntity[key as keyof Survey] !== value) {
            updatedEntity[key as keyof Survey] = value as any;
          }
        }
      }
    );
    builder.addCase(updateSurvey.pending, pendingReducer);
    builder.addCase(updateSurvey.rejected, errorReducer);

    // create
    builder.addCase(
      createSurvey.fulfilled,
      (state, { payload: surveyId, meta: { arg } }: NewSurveyResponse) => {
        state.pending = false;
        state.entities.splice(0, 0, { ...arg, id: surveyId });
        window.location.hash = `projects/${arg.projectId}/surveys/${surveyId}`;
      }
    );
    builder.addCase(createSurvey.pending, pendingReducer);
    builder.addCase(createSurvey.rejected, errorReducer);

    // delete
    builder.addCase(
      deleteSurvey.fulfilled,
      (
        state,
        {
          meta: {
            arg: { id: surveyId, projectId },
          },
        }: { meta: { arg: ProjectSubEntity } }
      ) => {
        const surveyIds = state.entities.map(({ id }) => id);
        const removedSurveyIndex = surveyIds.indexOf(surveyId);

        state.pending = false;
        state.entities.splice(removedSurveyIndex, 1);
        window.location.hash = `${ROUTES.PROJECTS}/${projectId}/surveys/new`;
      }
    );
    builder.addCase(deleteSurvey.pending, pendingReducer);
    builder.addCase(deleteSurvey.rejected, errorReducer);
  },
});

export const { clearSurveysState } = surveys.actions;
export default surveys;
