import React, { ChangeEvent } from 'react'
import { TextField, TextFieldProps } from '@material-ui/core'
import { FormikErrors } from 'formik'
import classNames from 'classnames'
import get from 'lodash.get'

import { Survey } from 'typings/entities'

import styles from './styles.module.scss'

export type FormProps = {
  values: Survey
  errors: FormikErrors<Record<string, any>>
  submitCount?: number
  handleChange?: (event: ChangeEvent) => void
}

export type Props = TextFieldProps & {
  name: string
  locale: string
  label?: string
  className?: string
  formProps: FormProps
}

export const SurveyFormInput = ({
  name,
  label,
  className,
  formProps = { errors: {}, values: {} as Survey },
  locale,
  ...textFieldProps
}: Props) => {
  const formFieldKey = `content.${locale}.${name}`
  const error = get(formProps.errors, formFieldKey)

  return (
    <div className={classNames(styles.inputWrapper, className)}>
      <TextField
        name={formFieldKey}
        label={label}
        value={get(formProps.values, formFieldKey, '')}
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
export default SurveyFormInput
