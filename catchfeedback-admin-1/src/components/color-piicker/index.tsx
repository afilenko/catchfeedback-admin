import React, { useEffect, useRef, useState } from 'react'
import { Popover } from '@material-ui/core'
// @ts-ignore
import { ChromePicker } from 'react-color'

import styles from './styles.module.scss'

type Props = { defaultColor?: string; onChange: (color: string) => void; label?: string }

export const ColorPicker = ({
  defaultColor = '#ffffff',
  onChange,
  label = 'Select color',
}: Props) => {
  const pickerAnchor = useRef(null)
  const [color, setColor] = useState(defaultColor)
  const [isOpen, setIsOpen] = useState(false)

  const handleColorChange = (color: string) => {
    setColor(color)
    onChange(color)
  }

  useEffect(() => {
    setColor(defaultColor)
  }, [defaultColor])

  return (
    <div className={styles.container}>
      <span
        ref={pickerAnchor}
        onClick={() => setIsOpen(true)}
        style={{ backgroundColor: color }}
        className={styles.colorIndicator}
      />
      {label}
      <Popover
        anchorEl={pickerAnchor.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <ChromePicker
          color={color}
          onChange={({ hex }: { hex: string }) => handleColorChange(hex)}
          disableAlpha={true}
        />
      </Popover>
    </div>
  )
}

export default ColorPicker
