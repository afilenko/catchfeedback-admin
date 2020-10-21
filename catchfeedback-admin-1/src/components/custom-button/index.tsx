import React from 'react'
import { Button, ButtonProps } from '@material-ui/core'
import classNames from 'classnames'

import styles from './styles.module.scss'

type Props = ButtonProps & {
  buttonColor?: 'red' | 'green'
}

export default ({ children, className, buttonColor, type, ...props }: Props) => (
  <Button
    {...props}
    type={type}
    variant="contained"
    className={classNames(
      {
        [styles.greenButton]: buttonColor === 'green' || type === 'submit',
        [styles.redButton]: buttonColor === 'red',
      },
      className,
    )}
  >
    {children}
  </Button>
)
