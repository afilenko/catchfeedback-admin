import React from 'react'
import { Switch, Route } from 'react-router-dom'

import NotFoundPage from 'pages/not-found'
import { ROUTES } from 'helpers/config'
import ProjectPage from 'pages/project'
import PromoPage from 'pages/promo'
import SurveyPage from 'pages/survey'
import SurveyDesignPage from 'pages/survey-design'

import styles from './styles.module.scss'

export default () => {
  return (
    <div className={styles.container}>
      <Switch>
        <Route path={`${ROUTES.PROJECTS}/:projectId/promotions/:promoId?`}>
          <PromoPage />
        </Route>
        <Route path={`${ROUTES.PROJECTS}/:projectId/surveys/:surveyId?/content`}>
          <SurveyPage />
        </Route>
        <Route path={`${ROUTES.PROJECTS}/:projectId/surveys/:surveyId?/design`}>
          <SurveyDesignPage />
        </Route>
        <Route path={`${ROUTES.PROJECTS}/:projectId/surveys/:surveyId?/qr`}>
          <div>QR Code Editor</div>
        </Route>
        <Route path={`${ROUTES.PROJECTS}/:projectId?`}>
          <ProjectPage />
        </Route>
        <Route path="*" exact={true} component={NotFoundPage} />
      </Switch>
    </div>
  )
}
