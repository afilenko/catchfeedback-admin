import React from 'react'

import styles from './styles.module.scss'

type Props = { children: React.ReactNode }

export default ({ children }: Props) => <div className={styles.formLabel}>{children}</div>
