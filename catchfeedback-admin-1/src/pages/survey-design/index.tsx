import React, { useMemo, useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import get from 'lodash.get'
import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core'
import {
  surveysSelector,
  isPendingSurveysSelector,
  surveyLocaleSelector,
} from 'store/surveys/selectors'
import { surveyThemesSelector } from 'store/surveyThemes/selectors'
import { fetchSurvey, updateSurvey } from 'store/surveys/actions'

import SubEntityTitle from 'components/sub-entity-title'
import ImageUpload from 'components/image-upload'
import CustomButton from 'components/custom-button'
import Form from 'components/form'
import ColorPicker from 'components/color-piicker'
import FormLabel from 'components/form-label'
import useProject from 'hooks/useProject'
import SurveyPreview from 'components/survey-preview'
import { GRADES, THEMES, THEME_NAMES } from 'helpers/constants'
import { getContentValue } from 'helpers/utils'

import styles from './styles.module.scss'
import { fetchSurveyThemes, fetchSurveyTheme } from 'store/surveyThemes/actions'

const INITIAL_VALUES = {
  design: {
    theme: 'custom',
    gradeEmoji: GRADES.map(() => ''),
    gradeEmojiSelected: GRADES.map(() => ''),
    headerTextColor: '#000000',
    contentBackgroundColor: '#ffffff',
    contentTextColor: '#000000',
    evaluationMark: '',
    evaluationMarkSelected: '',
    controlsBackgroundColor: '#ffa188',
    controlsTextColor: '#ffffff',
    inputsPlaceholderColor: '#5f5f5f',
    evaluationSectionBackgroundColor: '#f3f6fa',
    evaluationSectionTextColor: '#000000',
    shareAudioIcon: '',
    sharePhotoIcon: '',
  },
}

type DesignKeys = keyof typeof INITIAL_VALUES.design

export default () => {
  const dispatch = useDispatch()
  const { projectId, surveyId } = useParams<any>()
  const [selectedGrade, setSelectedGrade] = useState(GRADES.length - 1)
  const surveys = useSelector(surveysSelector)
  const pending = useSelector(isPendingSurveysSelector)
  const surveyLocale = useSelector(surveyLocaleSelector)
  const themes = useSelector(surveyThemesSelector)
  const project = useProject()

  useEffect(() => {
    dispatch(fetchSurvey(projectId))
  }, [dispatch, projectId])

  useEffect(() => {
    dispatch(fetchSurveyThemes())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchSurveyTheme(surveyId))
  }, [dispatch, surveyId])

  const handleSave = async () => {
    dispatch(updateSurvey({ design: formik.values.design, id: surveyId }))
  }

  const survey = useMemo(() => {
    return surveys && surveys.find(({ id }) => id === surveyId)
  }, [surveyId, surveys])

  const selectedDesign = useMemo(
    () =>
      survey?.design?.theme === THEME_NAMES.CUSTOM
        ? survey?.design
        : get(themes, survey?.design?.theme || '', INITIAL_VALUES),
    [themes, survey],
  )

  const formik = useFormik({
    initialValues: {
      ...survey,
      design: {
        ...INITIAL_VALUES.design,
        ...selectedDesign,
      },
    },
    enableReinitialize: true,
    onSubmit: handleSave,
  })

  const setColor = (propName: string, color: string) =>
    formik.setFieldValue('design', { ...formik.values.design, [propName]: color })

  const handleGradeEmojiUpload = useCallback(
    (url: string) => {
      const updatedGradeEmoji = [...formik.values.design.gradeEmoji]

      updatedGradeEmoji.splice(selectedGrade, 1, url)
      dispatch(
        updateSurvey({
          design: { ...formik.values.design, gradeEmoji: updatedGradeEmoji },
          id: surveyId,
        }),
      )
    },
    [dispatch, formik.values.design, selectedGrade, surveyId],
  )

  const handleGradeEmojiSelectedUpload = useCallback(
    (url: string) => {
      const updatedGradeEmoji = [...formik.values.design.gradeEmojiSelected]

      updatedGradeEmoji.splice(selectedGrade, 1, url)
      dispatch(
        updateSurvey({
          design: { ...formik.values.design, gradeEmojiSelected: updatedGradeEmoji },
          id: surveyId,
        }),
      )
    },
    [dispatch, formik.values.design, selectedGrade, surveyId],
  )

  const handleEvaluationMarkUpload = useCallback(
    (url: string) => {
      dispatch(
        updateSurvey({ design: { ...formik.values.design, evaluationMark: url }, id: surveyId }),
      )
    },
    [dispatch, formik.values.design, surveyId],
  )

  const handleEvaluationMarkSelectedUpload = useCallback(
    (url: string) => {
      dispatch(
        updateSurvey({
          design: { ...formik.values.design, evaluationMarkSelected: url },
          id: surveyId,
        }),
      )
    },
    [dispatch, formik.values.design, surveyId],
  )

  const handleShareAudioIconUpload = useCallback(
    (url: string) => {
      dispatch(
        updateSurvey({
          design: { ...formik.values.design, shareAudioIcon: url },
          id: surveyId,
        }),
      )
    },
    [dispatch, formik.values.design, surveyId],
  )

  const handleSharePhotoIconUpload = useCallback(
    (url: string) => {
      dispatch(
        updateSurvey({
          design: { ...formik.values.design, sharePhotoIcon: url },
          id: surveyId,
        }),
      )
    },
    [dispatch, formik.values.design, surveyId],
  )

  const getColor = (colorPropName: DesignKeys) =>
    get(formik.values, `design[${colorPropName}]`, INITIAL_VALUES.design[colorPropName])

  const handleThemeChange = useCallback(
    ({ target }) => {
      const themeId = target.value === THEME_NAMES.CUSTOM ? surveyId : target.value

      formik.setFieldValue('design', themes[themeId] || INITIAL_VALUES.design)
    },
    [formik, themes, surveyId],
  )

  return (
    <Form
      title={
        <SubEntityTitle
          title={getContentValue(formik.values, surveyLocale, 'title')}
          projectTitle={project?.title}
        />
      }
      onSubmit={formik.handleSubmit}
      onCancel={formik.resetForm}
      isUpdateDisabled={!formik.dirty || pending}
      className={styles.container}
      additionalControls={
        <CustomButton href={`/#/projects/${projectId}`}>Go to Project</CustomButton>
      }
    >
      <div className={styles.themesSection}>
        <FormLabel>Theme</FormLabel>
        <RadioGroup
          value={formik.values.design?.theme}
          className={styles.themeSelector}
          onChange={handleThemeChange}
        >
          {THEMES.map((theme: string) => (
            <FormControlLabel
              key={`${theme}-theme`}
              value={theme}
              label={theme}
              control={<Radio color="default" />}
            />
          ))}
        </RadioGroup>
      </div>
      <div className={styles.surveyPageLayout}>
        {formik.values.design?.theme === 'custom' ? (
          <div className={styles.inputsColumn}>
            <ImageUpload
              label="Header background image"
              image={survey?.design?.headerBackgroundImage}
              imagePath={`surveys/${surveyId}`}
              imageName="headerBackground"
              backgroundSize="cover"
              onComplete={(url) =>
                dispatch(
                  updateSurvey({
                    design: { ...formik.values.design, headerBackgroundImage: url },
                    id: surveyId,
                  }),
                )
              }
            />
            <ColorPicker
              onChange={(color: string) => setColor('headerBackgroundColor', color)}
              label="Header background color"
            />
            <ColorPicker
              defaultColor={getColor('headerTextColor')}
              onChange={(color: string) => setColor('headerTextColor', color)}
              label="Header text color"
            />
            <ColorPicker
              defaultColor={getColor('contentBackgroundColor')}
              onChange={(color: string) => setColor('contentBackgroundColor', color)}
              label="Content background color"
            />
            <ColorPicker
              defaultColor={getColor('contentTextColor')}
              onChange={(color: string) => setColor('contentTextColor', color)}
              label="Content text color"
            />
            <ColorPicker
              defaultColor={getColor('controlsBackgroundColor')}
              onChange={(color: string) => setColor('controlsBackgroundColor', color)}
              label="Controls background color"
            />
            <ColorPicker
              defaultColor={getColor('controlsTextColor')}
              onChange={(color: string) => setColor('controlsTextColor', color)}
              label="Controls text color"
            />
            <ColorPicker
              defaultColor={getColor('inputsPlaceholderColor')}
              onChange={(color: string) => setColor('inputsPlaceholderColor', color)}
              label="Inputs placeholder color"
            />
            <ColorPicker
              defaultColor={getColor('evaluationSectionBackgroundColor')}
              onChange={(color: string) => setColor('evaluationSectionBackgroundColor', color)}
              label="Evaluation section background color"
            />
            <ColorPicker
              defaultColor={getColor('evaluationSectionTextColor')}
              onChange={(color: string) => setColor('evaluationSectionTextColor', color)}
              label="Evaluation section background color"
            />
            <FormLabel className={styles.emojiUploadLabel}>User impression emoji</FormLabel>
            <RadioGroup
              row
              value={selectedGrade}
              className={styles.grades}
              onChange={({ target }) => setSelectedGrade(+target.value)}
            >
              {GRADES.map((grade) => (
                <FormControlLabel
                  key={`grade-${grade}-selector`}
                  value={grade}
                  label={grade + 1}
                  labelPlacement="top"
                  control={<Radio color="default" />}
                  classes={{ labelPlacementTop: styles.grade }}
                />
              ))}
            </RadioGroup>
            <div className={styles.iconPreview}>
              <ImageUpload
                width={100}
                height={100}
                backgroundSize={'45px 45px'}
                className={styles.iconUpload}
                label="normal"
                image={formik.values.design.gradeEmoji[selectedGrade]}
                imagePath={`surveys/${surveyId}/gradeEmoji`}
                imageName={`grade_${selectedGrade + 1}_emoji`}
                onComplete={handleGradeEmojiUpload}
              />
              <ImageUpload
                width={100}
                height={100}
                backgroundSize={'45px 45px'}
                className={styles.iconUpload}
                label="selected"
                image={formik.values.design.gradeEmojiSelected[selectedGrade]}
                imagePath={`surveys/${surveyId}/gradeEmojiSelected`}
                imageName={`grade_${selectedGrade + 1}_emoji`}
                onComplete={handleGradeEmojiSelectedUpload}
              />
            </div>

            <FormLabel>Evaluation mark</FormLabel>
            <div className={styles.iconPreview}>
              <ImageUpload
                width={100}
                height={100}
                backgroundSize={'41px 40px'}
                className={styles.iconUpload}
                label="normal"
                image={formik.values.design.evaluationMark}
                imagePath={`surveys/${surveyId}/evaluationMark`}
                imageName="normal"
                onComplete={handleEvaluationMarkUpload}
              />
              <ImageUpload
                width={100}
                height={100}
                backgroundSize={'41px 40px'}
                className={styles.iconUpload}
                label="selected"
                image={formik.values.design.evaluationMarkSelected}
                imagePath={`surveys/${surveyId}/evaluationMark`}
                imageName="selected"
                onComplete={handleEvaluationMarkSelectedUpload}
              />
            </div>
            <FormLabel>Share icons</FormLabel>
            <div className={styles.iconPreview}>
              <ImageUpload
                width={100}
                height={100}
                backgroundSize={'40px 40px'}
                className={styles.iconUpload}
                label="audio"
                image={formik.values.design.shareAudioIcon}
                imagePath={`surveys/${surveyId}/shareIcons`}
                imageName="share-audio-icon"
                onComplete={handleShareAudioIconUpload}
              />
              <ImageUpload
                width={100}
                height={100}
                backgroundSize={'40px 40px'}
                className={styles.iconUpload}
                label="photo"
                image={formik.values.design.sharePhotoIcon}
                imagePath={`surveys/${surveyId}/shareIcons`}
                imageName="share-photo-icon"
                onComplete={handleSharePhotoIconUpload}
              />
            </div>
          </div>
        ) : null}
        <SurveyPreview data={formik.values} grade={selectedGrade} />
      </div>
    </Form>
  )
}
