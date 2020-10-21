import React from 'react'

import styles from './styles.module.scss'

type Props = {
  title?: string
  projectTitle?: string
}

export default ({ title, projectTitle }: Props) => (
  <>
    <span className={styles.title}>{title}</span>
    <span className={styles.projectTitle}>{projectTitle}</span>
  </>
)
