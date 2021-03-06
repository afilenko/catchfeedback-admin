import React, { ChangeEvent } from 'react'
import { TextField, TextFieldProps } from '@material-ui/core'
import { FormikErrors } from 'formik'
import classNames from 'classnames'
import get from 'lodash.get'

import styles from './styles.module.scss'

export type FormProps = {
  values?: Record<string, any>
  errors: FormikErrors<Record<string, any>>
  submitCount?: number
  handleChange?: (event: ChangeEvent) => void
}

export type Props = TextFieldProps & {
  name: string
  label?: string
  className?: string
  formProps: FormProps
}

export const FormInput = ({
  name,
  label,
  className,
  formProps = { errors: {}, values: {} },
  ...textFieldProps
}: Props) => {
  const error = get(formProps.errors, name)

  return (
    <div className={classNames(styles.inputWrapper, className)}>
      <TextField
        name={name}
        label={label}
        value={get(formProps.values, name, '')}
        FormHelperTextProps={{
          className: styles.error,
        }}
        onChange={formProps.handleChange}
        error={!!(formProps.submitCount && error)}
        helperText={!!formProps.submitCount && error}
        fullWidth={true}
        {...textFieldProps}
      />
    </div>
  )
}

export default FormInput
