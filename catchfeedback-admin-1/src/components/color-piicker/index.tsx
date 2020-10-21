import React, { useState } from 'react'
// @ts-ignore
import { ChromePicker } from 'react-color'

type Props = { defaultColor?: string; onChange: (color: string) => void }

export default ({ defaultColor, onChange }: Props) => {
  const [color, setColor] = useState(defaultColor)

  return (
    <ChromePicker
      color={color}
      onChange={({ hex }: { hex: string }) => onChange(hex)}
      disableAlpha={true}
    />
  )
}
