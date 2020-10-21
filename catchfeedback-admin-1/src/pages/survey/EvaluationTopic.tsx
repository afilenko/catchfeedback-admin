import React, { useRef, useState } from 'react'
import { IconButton, TextField, Menu, MenuItem } from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'

import styles from './EvaluationTopic.module.scss'

type Props = {
  value: string
  index: number
  onRemove: (index: number) => void
  onChangeText: (value: string, index: number) => void
  onChangeOrder: (direction: number, index: number) => void
  isMoveUpDisabled?: boolean
  isMoveDownDisabled?: boolean
}

export default ({
  value,
  index,
  onRemove,
  onChangeText,
  onChangeOrder,
  isMoveUpDisabled,
  isMoveDownDisabled,
}: Props) => {
  const menuAnchor = useRef<HTMLButtonElement | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <div className={styles.container}>
      <TextField
        label="Topic"
        value={value || ''}
        onChange={({ target }) => onChangeText(target.value, index)}
        fullWidth={true}
      />
      <IconButton
        ref={menuAnchor}
        className={styles.orderButton}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu anchorEl={menuAnchor.current} open={isMenuOpen} onClose={closeMenu}>
        <MenuItem
          onClick={() => {
            onChangeOrder(-1, index)
            closeMenu()
          }}
          disabled={isMoveUpDisabled}
        >
          Move up
        </MenuItem>
        <MenuItem
          onClick={() => {
            onChangeOrder(1, index)
            closeMenu()
          }}
          disabled={isMoveDownDisabled}
        >
          Move down
        </MenuItem>
        <MenuItem
          onClick={() => {
            onRemove(index)
            closeMenu()
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </div>
  )
}
