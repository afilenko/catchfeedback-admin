import get from 'lodash.get'

import { Survey } from 'typings/entities'

export const getContentValue = (
  survey: Survey,
  locale: string,
  valuePath: string,
  defaultValue: any = '',
) => get(survey, `content.${locale}.${valuePath}`, defaultValue)
