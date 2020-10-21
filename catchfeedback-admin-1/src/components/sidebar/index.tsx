import React from 'react'
import { Switch, Route } from 'react-router-dom'

import ProjectsSidebar from './projects'
import PromoSidebar from './promo'
import SurveySidebar from './survey'
import { ROUTES } from 'helpers/config'

export default () => {
  return (
    <Switch>
      <Route path={`${ROUTES.PROJECTS}/:projectId/promotions/:promoId?`} component={PromoSidebar} />
      <Route
        path={`${ROUTES.PROJECTS}/:projectId/surveys/:surveyId?/:surveyEditMode?`}
        component={SurveySidebar}
      />
      <Route path={`${ROUTES.PROJECTS}/:projectId?`} component={ProjectsSidebar} />
      <Route path="*" exact={true} component={() => null} />
    </Switch>
  )
}
