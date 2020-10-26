import { createSlice } from '@reduxjs/toolkit'
import { ROUTES } from 'helpers/config'

import { ProjectSubEntity, Promotion } from 'typings/entities'
import { fetchPromotions, createPromotion, updatePromotion, deletePromotion } from './actions'

export type ArgumentsOfSaveOrderItemAction = {
  orderId: number
  productId: number
  checked: boolean
}

type PromotionsState = {
  entities: Promotion[]
  error: any
  pending: boolean
}

type NewPromotionResponse = {
  payload: string
  meta: { arg: Promotion }
}

const promotions = createSlice({
  name: 'promotions',
  initialState: {
    entities: [],
    error: null,
    pending: false,
  } as PromotionsState,
  reducers: {
    clearPromotionsState() {
      return { entities: [], pending: false, error: null }
    },
  },
  extraReducers: (builder) => {
    const pendingReducer = (state: PromotionsState) => {
      state.pending = true
      state.error = null
    }
    const errorReducer = (state: PromotionsState, action: any) => {
      state.pending = false
      // TODO: add specific details from the args/payload if needed
      state.error = 'Something went wrong'
    }

    // fetch
    builder.addCase(fetchPromotions.fulfilled, (state, { payload }) => {
      state.entities = payload || []
      state.pending = false
      state.error = null
    })
    builder.addCase(fetchPromotions.pending, pendingReducer)
    builder.addCase(fetchPromotions.rejected, errorReducer)

    // update
    builder.addCase(updatePromotion.fulfilled, (state, { meta }: { meta: { arg: Promotion } }) => {
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
        if (updatedEntity[key as keyof Promotion] !== value) {
          ;(updatedEntity[key as keyof Promotion] as typeof value) = value
        }
      }
    })
    builder.addCase(updatePromotion.pending, pendingReducer)
    builder.addCase(updatePromotion.rejected, errorReducer)

    // create
    builder.addCase(
      createPromotion.fulfilled,
      (state, { payload: promotionId, meta: { arg } }: NewPromotionResponse) => {
        state.pending = false
        state.entities.splice(0, 0, { ...arg, id: promotionId })
        window.location.hash = `${ROUTES.PROJECTS}/${arg.projectId}${ROUTES.PROMOTIONS}/${promotionId}`
      },
    )
    builder.addCase(createPromotion.pending, pendingReducer)
    builder.addCase(createPromotion.rejected, errorReducer)

    // delete
    builder.addCase(
      deletePromotion.fulfilled,
      (
        state,
        {
          meta: {
            arg: { id: promotionId, projectId },
          },
        }: { meta: { arg: ProjectSubEntity } },
      ) => {
        state.pending = false
        const promotionIds = state.entities.map(({ id }) => id)
        const removedPromotionIndex = promotionIds.indexOf(promotionId)

        state.entities.splice(removedPromotionIndex, 1)
        window.location.hash = `${ROUTES.PROJECTS}/${projectId}${ROUTES.PROMOTIONS}`
      },
    )
    builder.addCase(deletePromotion.pending, pendingReducer)
    builder.addCase(deletePromotion.rejected, errorReducer)
  },
})

export const { clearPromotionsState } = promotions.actions
export default promotions
