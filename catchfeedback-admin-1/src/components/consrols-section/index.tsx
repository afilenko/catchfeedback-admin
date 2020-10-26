import React from 'react'
import classNames from 'classnames'

import { Paper } from '@material-ui/core'

import styles from './styles.module.scss'

type Props = {
  children?: React.ReactNode
  className?: string
}

export const ControlsSection = ({ children, className }: Props) => (
  <Paper className={classNames(styles.container, className)}>{children}</Paper>
)

export default ControlsSection
