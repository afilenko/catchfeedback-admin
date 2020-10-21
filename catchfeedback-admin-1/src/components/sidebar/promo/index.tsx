import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { ROUTES } from 'helpers/config'
import List from 'components/list'
import CustomButton from 'components/custom-button'
import { promotionsSelector } from 'store/promotions/selectors'
import { fetchPromotions } from 'store/promotions/actions'

import styles from './styles.module.scss'

export default () => {
  const dispatch = useDispatch()
  const promotions = useSelector(promotionsSelector)
  const { promoId, projectId } = useParams<any>()
  const selectedPromotions = useMemo(
    () => promotions.filter((promotion) => promotion.projectId === projectId),
    [promotions, projectId],
  )

  useEffect(() => {
    dispatch(fetchPromotions(projectId))
  }, [dispatch, projectId])

  return (
    <div className={styles.container}>
      <List
        items={selectedPromotions}
        selectedItem={promoId || selectedPromotions[0]?.id}
        listPath={`${ROUTES.PROJECTS}/${projectId}/promotions`}
      />
      <CustomButton
        href={`/#${ROUTES.PROJECTS}/${projectId}/promotions/new`}
        className={styles.addPromoButton}
        buttonColor="green"
      >
        Add Promo
      </CustomButton>
    </div>
  )
}
