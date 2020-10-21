import React, { ChangeEvent } from 'react'
import { TextField, TextFieldProps } from '@material-ui/core'
import { FormikErrors } from 'formik'

import styles from './styles.module.scss'

export type FormProps = {
  values?: Record<string, any>
  errors: FormikErrors<Record<string, any>>
  submitCount?: number
  handleChange?: (event: ChangeEvent) => void
}

export type Props = TextFieldProps & {
  name: string
  label: string
  formProps: FormProps
}

export default ({
  name,
  label,
  formProps = { errors: {}, values: {} },
  ...textFieldProps
}: Props) => (
  <div className={styles.inputWrapper}>
    <TextField
      name={name}
      label={label}
      value={(formProps.values && formProps.values[name]) || ''}
      FormHelperTextProps={{
        className: styles.error,
      }}
      onChange={formProps.handleChange}
      error={!!(formProps.submitCount && formProps.errors[name])}
      helperText={!!formProps.submitCount && formProps.errors[name]}
      fullWidth={true}
      {...textFieldProps}
    />
  </div>
)
