import { createSlice } from '@reduxjs/toolkit'
import { APP_LOCALES } from 'helpers/constants'

import { Survey } from 'typings/entities'
import { fetchSurvey, updateSurvey } from './actions'

export type ArgumentsOfSaveOrderItemAction = {
  orderId: number
  productId: number
  checked: boolean
}

type SurveysState = {
  entities: Survey[]
  error: any
  pending: boolean
  locale: string
}

type NewSurveyResponse = {
  payload: string
  meta: { arg: Survey }
}

const INITIAL_STATE: SurveysState = {
  entities: [],
  pending: false,
  error: null,
  locale: APP_LOCALES[0].value,
}

const surveys = createSlice({
  name: 'surveys',
  initialState: INITIAL_STATE,
  reducers: {
    clearSurveysState(state) {
      state = { ...INITIAL_STATE }
    },
    setSurveyLocale(state, { payload }: { payload: string }) {
      state.locale = payload
    },
  },
  extraReducers: (builder) => {
    const pendingReducer = (state: SurveysState) => {
      state.pending = true
      state.error = null
    }
    const errorReducer = (state: SurveysState) => {
      state.pending = false
      // TODO: add specific details from the args/payload if needed
      state.error = 'Something went wrong'
    }

    // fetch
    builder.addCase(fetchSurvey.fulfilled, (state, { payload }) => {
      const survey = payload && payload[0]
      if (survey) {
        state.entities.push(survey)
      }

      state.pending = false
      state.error = null
    })
    builder.addCase(fetchSurvey.pending, pendingReducer)
    builder.addCase(fetchSurvey.rejected, errorReducer)

    // update
    builder.addCase(updateSurvey.fulfilled, (state, { meta }: { meta: { arg: Survey } }) => {
      const { arg } = meta

      state.pending = false

      if (!arg) {
        return
      }

      let updatedEntity = state.entities.find(({ id }) => id === arg.id)

      if (!updatedEntity) {
        return
      }

      for (const [key, value] of Object.entries(arg)) {
        if (updatedEntity[key as keyof Survey] !== value) {
          updatedEntity[key as keyof Survey] = value as any
        }
      }
    })
    builder.addCase(updateSurvey.pending, pendingReducer)
    builder.addCase(updateSurvey.rejected, errorReducer)
  },
})

export const { clearSurveysState } = surveys.actions
export default surveys
