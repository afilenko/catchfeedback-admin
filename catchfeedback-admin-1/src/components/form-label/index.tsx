import React from 'react'
import classNames from 'classnames'

import styles from './styles.module.scss'

type Props = { children?: React.ReactNode; className?: string }

export const FormLabel = ({ children, className }: Props) => (
  <div className={classNames(styles.formLabel, className)}>{children}</div>
)

export default FormLabel
