import React, { useMemo, useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import get from 'lodash.get'
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import {
  surveysSelector,
  isPendingSurveysSelector,
  surveyLocaleSelector,
} from 'store/surveys/selectors'
import { fetchSurvey, updateSurvey, setSurveyLocale } from 'store/surveys/actions'
import SubEntityTitle from 'components/sub-entity-title'
import FormInput from 'components/form-input'
import ImageUpload from 'components/image-upload'
import CustomButton from 'components/custom-button'
import Form from 'components/form'
import FormLabel from 'components/form-label'
import useProject from 'hooks/useProject'
import EvaluationTopic from './EvaluationTopic'
import SurveyPreview from 'components/survey-preview'
import { APP_LOCALES, GRADES } from 'helpers/constants'
import { getContentValue } from 'helpers/utils'
import ControlsSection from 'components/consrols-section'

import styles from './styles.module.scss'

// NOTE: let's make title optional for now.
// Also let'sleave this commented out code for future reference.
// const VALIDATION_SCHEMA = object({
//   title: string().required('This field is required'),
// })

const DEFAULT_CONTENT_VALUES = {
  title: '',
  evaluationTopics: [],
  sharingQuestions: GRADES.map(() => ''),
  contactSectionTitles: GRADES.map(() => ''),
  contactSectionTitle: '',
}

export default () => {
  const dispatch = useDispatch()
  const { projectId, surveyId } = useParams<any>()
  const surveys = useSelector(surveysSelector)
  const pending = useSelector(isPendingSurveysSelector)
  const surveyLocale = useSelector(surveyLocaleSelector)
  const project = useProject()
  const [selectedGrade, setSelectedGrade] = useState(GRADES.length - 1)

  useEffect(() => {
    dispatch(fetchSurvey(projectId))
  }, [dispatch, projectId])

  const handleSave = async () => {
    dispatch(updateSurvey({ ...formik.values, id: surveyId }))
  }

  const survey = useMemo(() => {
    return surveys && surveys.find(({ id }) => id === surveyId)
  }, [surveyId, surveys])

  const formik = useFormik({
    initialValues: {
      ...survey,
      content: {
        [surveyLocale]: {
          ...DEFAULT_CONTENT_VALUES,
          ...get(survey, `content.${surveyLocale}`, {}),
        },
      },
    },
    // Let'sleave this commented out code for future reference.
    // validationSchema: object({
    //   content: object({
    //     [surveyLocale]: VALIDATION_SCHEMA,
    //   }),
    // }),
    enableReinitialize: true,
    onSubmit: handleSave,
  })

  const handleRemoveEvaluationTopic = (index: number) => {
    const formFieldKey = `content.${surveyLocale}.evaluationTopics`
    const updatedValues = [...get(formik.values, formFieldKey, [])]

    updatedValues.splice(index, 1)
    formik.setFieldValue(formFieldKey, updatedValues)
  }

  const handleEvaluationTopicChange = (value: string, index: number) => {
    const formFieldKey = `content.${surveyLocale}.evaluationTopics`
    const updatedValues = [...get(formik.values, formFieldKey, [])]

    updatedValues.splice(index, 1, value)
    formik.setFieldValue(formFieldKey, updatedValues)
  }

  const handleEvaluationTopicReorder = (direction: number, index: number) => {
    const formFieldKey = `content.${surveyLocale}.evaluationTopics`
    const updatedValues = [...get(formik.values, formFieldKey, [])]
    const indexToSwap = index + direction
    const valueToSwap = updatedValues[indexToSwap]

    updatedValues.splice(indexToSwap, 1, updatedValues[index])
    updatedValues.splice(index, 1, valueToSwap)
    formik.setFieldValue(formFieldKey, updatedValues)
  }

  const handleAddQuestion = () => {
    const formFieldKey = `content.${surveyLocale}.evaluationTopics`
    const updatedValues = [...get(formik.values, formFieldKey, [])]

    updatedValues.push('')
    formik.setFieldValue(formFieldKey, updatedValues)
  }

  const handleSharingQuestionChange = useCallback(
    ({ target }: any) => {
      const formFieldKey = `content.${surveyLocale}.sharingQuestions`
      const updatedValues = [...get(formik.values, formFieldKey, [])]

      updatedValues.splice(selectedGrade, 1, target?.value)
      formik.setFieldValue(formFieldKey, updatedValues)
    },
    [formik, selectedGrade, surveyLocale],
  )

  const handleContactSectionTitleChange = useCallback(
    ({ target }: any) => {
      const formFieldKey = `content.${surveyLocale}.contactSectionTitles`
      const updatedValues = [...get(formik.values, formFieldKey, [])]

      updatedValues.splice(selectedGrade, 1, target?.value)
      formik.setFieldValue(formFieldKey, updatedValues)
    },
    [formik, selectedGrade, surveyLocale],
  )

  const handleIncludedLocalesChange = useCallback(
    (isIncludedLocale: boolean) => {
      formik.setFieldValue(`content.${surveyLocale}.included`, isIncludedLocale)
    },
    [formik, surveyLocale],
  )

  const getInputName = useCallback((name) => `content.${surveyLocale}.${name}`, [surveyLocale])

  const evaluationTopics = useMemo(
    () => getContentValue(formik.values, surveyLocale, 'evaluationTopics', []),
    [formik.values, surveyLocale],
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
      <div className={styles.surveyPageLayout}>
        <div className={styles.inputsColumn}>
          <ImageUpload
            label="Logo"
            image={survey?.logo}
            imagePath={`surveys/${surveyId}`}
            imageName="logo"
            onComplete={(url) => dispatch(updateSurvey({ logo: url, id: surveyId }))}
          />
          <ControlsSection className={styles.sectionWrapper}>
            <FormControl fullWidth={true} className={styles.localeSelect}>
              <InputLabel>Survey language</InputLabel>
              <Select
                value={surveyLocale}
                onChange={({ target }: any) => dispatch(setSurveyLocale(target.value))}
              >
                {APP_LOCALES.map(({ value, label }) => (
                  <MenuItem key={`locale-option-${value}`} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!formik.values.content[surveyLocale]?.included}
                  onChange={(_, value) => handleIncludedLocalesChange(value)}
                  classes={{
                    checked: styles.localeCheckboxChecked,
                  }}
                />
              }
              label="Include in the app"
              className={styles.localeCheckbox}
            />
          </ControlsSection>
          <FormInput label="Title" name={getInputName('title')} formProps={formik} />
          <FormInput label="Sub title" name={getInputName('subTitle')} formProps={formik} />
          <ControlsSection className={styles.feedbackSectionWrapper}>
            <FormInput
              label="Ask customers about..."
              name={getInputName('surveyTopic')}
              formProps={formik}
            />
            <FormLabel>Comment section title</FormLabel>
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
            <TextField
              className={styles.sharingQuestionsInput}
              label={`Grade ${selectedGrade + 1} response text`}
              value={getContentValue(
                formik.values,
                surveyLocale,
                `sharingQuestions[${selectedGrade}]`,
              )}
              onChange={handleSharingQuestionChange}
              fullWidth={true}
              multiline
            />
            <TextField
              className={styles.contactSectionTitlesInput}
              label={`Grade ${selectedGrade + 1} contact section title`}
              value={getContentValue(
                formik.values,
                surveyLocale,
                `contactSectionTitles[${selectedGrade}]`,
              )}
              onChange={handleContactSectionTitleChange}
              fullWidth={true}
              multiline
            />
          </ControlsSection>
          <FormInput
            label="Feedback input label"
            name={getInputName('feedbackInputLabel')}
            formProps={formik}
          />
          <FormInput
            label="Email input label"
            name={getInputName('emailInputLabel')}
            formProps={formik}
          />
          <FormInput
            label="Phone input label"
            name={getInputName('phoneInputLabel')}
            formProps={formik}
          />
          <ControlsSection className={styles.sectionWrapper}>
            <FormInput
              label="Evaluation label"
              name={getInputName('evaluationLabel')}
              formProps={formik}
              className={styles.evaluationLabel}
              multiline
            />
            <Accordion className={styles.evaluationTopicsSection} defaultExpanded={true}>
              <AccordionSummary
                className={styles.evaluationTopicsSectionSummary}
                expandIcon={<ExpandMoreIcon />}
              >
                Evaluation topics
              </AccordionSummary>
              <AccordionDetails className={styles.evaluationTopicsSectionDetail}>
                {get(formik.values, `content.${surveyLocale}.evaluationTopics`, []).map(
                  (topicTitle: string, i: number) => (
                    // eslint-disable-next-line react/jsx-key
                    <EvaluationTopic
                      value={topicTitle}
                      index={i}
                      onRemove={handleRemoveEvaluationTopic}
                      onChangeText={handleEvaluationTopicChange}
                      onChangeOrder={handleEvaluationTopicReorder}
                      isMoveUpDisabled={i === 0}
                      isMoveDownDisabled={i === evaluationTopics.length - 1}
                    />
                  ),
                )}
                <div>
                  <CustomButton
                    onClick={handleAddQuestion}
                    className={styles.addQuestionButton}
                    buttonColor="green"
                  >
                    Add topic
                  </CustomButton>
                </div>
              </AccordionDetails>
            </Accordion>
          </ControlsSection>
          <FormInput
            multiline
            name={getInputName('recommendationQuestionText')}
            label="Recommendation question text"
            formProps={formik}
          />
          <FormInput
            label="Submit button text"
            name={getInputName('submitButtonText')}
            formProps={formik}
          />
        </div>
        <SurveyPreview data={formik.values} grade={selectedGrade} />
      </div>
    </Form>
  )
}
