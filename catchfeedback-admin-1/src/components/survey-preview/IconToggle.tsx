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

export const IconToggle = ({
  width,
  height,
  normalStateURL,
  selectedStateURL,
  selected,
  onClick,
}: Props) => (
  <div
    className={styles.container}
    style={{
      width: `${width}px`,
      height: `${height}px`,
    }}
    onClick={onClick}
  >
    {normalStateURL ? (
      <img
        key={normalStateURL}
        src={normalStateURL}
        style={{
          visibility: !selected ? 'visible' : 'hidden',
        }}
      />
    ) : null}
    {selectedStateURL ? (
      <img
        key={selectedStateURL}
        src={selectedStateURL}
        style={{
          visibility: selected ? 'visible' : 'hidden',
        }}
      />
    ) : null}
  </div>
)

export default IconToggle
