import React, { useMemo } from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import { Tabs, Tab } from '@material-ui/core'
import * as firebase from 'firebase/app'

import { authenticate } from 'helpers/firebase'
import { NAV_TABS, ROUTES } from 'helpers/config'
import { AuthUser } from 'typings/entities'
import Sidebar from 'components/sidebar'
import Content from 'components/content'
import logo from 'assets/images/logo.png'

import styles from './styles.module.scss'

type Props = {
  currentUser: AuthUser | null
}

export default ({ currentUser }: Props) => {
  const { name } = currentUser || {}
  const projectsRouteMatch = useRouteMatch('/projects/:projectId?')
  const answersRouteMatch = useRouteMatch('/answers/:answerId?')

  const selectedPage = useMemo(() => {
    if (projectsRouteMatch) {
      return ROUTES.PROJECTS
    }

    if (answersRouteMatch) {
      return ROUTES.ANSWERS
    }
  }, [projectsRouteMatch, answersRouteMatch])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img className={styles.logo} src={logo} alt="catchfeedback" />
        <Tabs
          textColor="inherit"
          value={selectedPage}
          TabIndicatorProps={{
            style: { background: '#00bcd4', height: '3px' },
          }}
          centered={true}
        >
          {NAV_TABS.map(({ label, link }) => (
            <Tab key={`nav-tab-${label}`} label={label} component={Link} value={link} to={link} />
          ))}
        </Tabs>
        <div className={styles.authUserControls}>
          {name}
          {currentUser ? (
            <span className={styles.authButton} onClick={() => firebase.auth().signOut()}>
              Sign out
            </span>
          ) : (
            <span className={styles.authButton} onClick={() => authenticate()}>
              Log in
            </span>
          )}
        </div>
      </div>
      {currentUser ? (
        <div className={styles.content}>
          <Sidebar />
          <Content />
        </div>
      ) : null}
      {/* TODO: display landing page instead of null */}
    </div>
  )
}
