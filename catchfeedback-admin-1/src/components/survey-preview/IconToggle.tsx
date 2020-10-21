/* eslint-disable jsx-a11y/alt-text */
import React from 'react'

import styles from './IconToggle.module.scss'

type Props = {
  width: number
  height: number
  normalStateURL?: string
  selectedStateURL?: string
  selected?: boolean
  onClick?: () => void
}

export default ({ width, height, normalStateURL, selectedStateURL, selected, onClick }: Props) => {
  return (
    <div
      className={styles.container}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
      onClick={onClick}
    >
      <img
        key={normalStateURL}
        src={normalStateURL}
        style={{
          visibility: !selected ? 'visible' : 'hidden',
        }}
      />
      <img
        key={selectedStateURL}
        src={selectedStateURL}
        style={{
          visibility: selected ? 'visible' : 'hidden',
        }}
      />
    </div>
  )
}
