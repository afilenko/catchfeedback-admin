import React, { useMemo, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import { object, string } from 'yup'

import { surveysSelector, isPendingSurveysSelector } from 'store/surveys/selectors'
import { fetchSurvey, updateSurvey, deleteSurvey } from 'store/surveys/actions'

import SubEntityTitle from 'components/sub-entity-title'
import ImageUpload from 'components/image-upload'
import CustomButton from 'components/custom-button'
import Form from 'components/form'
import ColorPicker from 'components/color-piicker'
import useProject from 'hooks/useProject'
import SurveyPreview from 'components/survey-preview'

import styles from './styles.module.scss'

const VALIDATION_SCHEMA = object({
  title: string().required('This field is required'),
})

const INITIAL_VALUES = {}

export default () => {
  const dispatch = useDispatch()
  const { projectId, surveyId } = useParams<any>()
  const surveys = useSelector(surveysSelector)
  const pending = useSelector(isPendingSurveysSelector)
  const project = useProject()

  useEffect(() => {
    dispatch(fetchSurvey(projectId))
  }, [dispatch, projectId])

  const handleSave = async () => {
    dispatch(updateSurvey({ ...formik.values, id: surveyId }))
  }

  const handleDelete = () => {
    dispatch(deleteSurvey({ id: surveyId, projectId }))
  }

  const survey = useMemo(() => {
    return surveys && surveys.find(({ id }) => id === surveyId)
  }, [surveyId, surveys])

  const formik = useFormik({
    initialValues: { ...INITIAL_VALUES, ...survey },
    validationSchema: VALIDATION_SCHEMA,
    enableReinitialize: true,
    onSubmit: handleSave,
  })

  return (
    <Form
      title={<SubEntityTitle title={survey?.title} projectTitle={project?.title} />}
      onDelete={handleDelete}
      onSubmit={formik.handleSubmit}
      onCancel={formik.resetForm}
      isUpdateDisabled={!formik.dirty || pending}
      className={styles.container}
      additionalControls={
        <CustomButton href={`/#/projects/${projectId}`}>Go to Project</CustomButton>
      }
    >
      <div className={styles.surveyPageLayout}>
        <div className={styles.inputsColumn}>
          <ImageUpload
            label="Header background"
            image={survey?.design?.headerBackgroundImage}
            imagePath={`surveys/${surveyId}`}
            imageName="headerBackground"
            onComplete={(url) =>
              dispatch(
                updateSurvey({
                  design: { ...survey?.design, headerBackgroundImage: url },
                  id: surveyId,
                }),
              )
            }
          />
          <ColorPicker
            onChange={(color: string) => formik.setFieldValue('headerBackgroundColor', color)}
          />
          <ColorPicker
            defaultColor="#000000"
            onChange={(color: string) => formik.setFieldValue('headerTextColor', color)}
          />
        </div>
        <SurveyPreview data={survey} />
      </div>
    </Form>
  )
}

// #ffa188
