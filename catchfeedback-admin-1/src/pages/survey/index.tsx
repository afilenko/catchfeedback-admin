import React, { useMemo, useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import { object, string } from 'yup'
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { surveysSelector, isPendingSurveysSelector } from 'store/surveys/selectors'
import { fetchSurvey, createSurvey, updateSurvey, deleteSurvey } from 'store/surveys/actions'
import SubEntityTitle from 'components/sub-entity-title'
import FormInput from 'components/form-input'
import ImageUpload from 'components/image-upload'
import CustomButton from 'components/custom-button'
import Form from 'components/form'
import useProject from 'hooks/useProject'
import EvaluationTopic from './EvaluationTopic'
import SurveyPreview from 'components/survey-preview'

import styles from './styles.module.scss'

const VALIDATION_SCHEMA = object({
  title: string().required('This field is required'),
})

const GRADES = [0, 1, 2, 3, 4]

const INITIAL_VALUES = {
  title: '',
  description: '',
  evaluationTopics: [],
  sharingQuestions: GRADES.map(() => ''),
  contactSectionTitles: GRADES.map(() => ''),
  gradeEmoji: GRADES.map(() => ''),
  gradeEmojiSelected: GRADES.map(() => ''),
  contactSectionTitle: '',
  evaluationMark: '',
  evaluationMarkSelected: '',
}

export default () => {
  const dispatch = useDispatch()
  const { projectId, surveyId } = useParams<any>()
  const surveys = useSelector(surveysSelector)
  const pending = useSelector(isPendingSurveysSelector)
  const project = useProject()
  const [selectedGrade, setSelectedGrade] = useState(GRADES.length - 1)
  const isCreateMode = surveyId === 'new'

  useEffect(() => {
    dispatch(fetchSurvey(projectId))
  }, [dispatch, projectId])

  const handleSave = async () => {
    if (isCreateMode) {
      dispatch(createSurvey({ ...formik.values, projectId }))
    } else {
      dispatch(updateSurvey({ ...formik.values, id: surveyId }))
    }
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

  const handleRemoveQuestion = (index: number) => {
    const updatedQuestions = [...formik.values.evaluationTopics]

    updatedQuestions.splice(index, 1)
    formik.setFieldValue('evaluationTopics', updatedQuestions)
  }

  const handleChangeQuestionText = (value: string, index: number) => {
    const updatedQuestions = [...formik.values.evaluationTopics]

    updatedQuestions.splice(index, 1, value)
    formik.setFieldValue('evaluationTopics', updatedQuestions)
  }

  const handleChangeQuestionOrder = (direction: number, index: number) => {
    const updatedQuestions = [...formik.values.evaluationTopics]
    const indexToSwap = index + direction
    const valueToSwap = updatedQuestions[indexToSwap]

    updatedQuestions.splice(indexToSwap, 1, updatedQuestions[index])
    updatedQuestions.splice(index, 1, valueToSwap)
    formik.setFieldValue('evaluationTopics', updatedQuestions)

    console.log({ direction, index, indexToInsert: indexToSwap })
  }

  const handleAddQuestion = () => {
    formik.setFieldValue('evaluationTopics', [...formik.values.evaluationTopics, ''])
  }

  const handleSharingQuestionChange = useCallback(
    ({ target }: any) => {
      const updatedQuestions = [...formik.values.sharingQuestions]

      updatedQuestions.splice(selectedGrade, 1, target?.value)
      formik.setFieldValue('sharingQuestions', updatedQuestions)
    },
    [formik, selectedGrade],
  )

  const handleContactSectionTitleChange = useCallback(
    ({ target }: any) => {
      const updatedContactSectionTitles = [...formik.values.contactSectionTitles]

      updatedContactSectionTitles.splice(selectedGrade, 1, target?.value)
      formik.setFieldValue('contactSectionTitles', updatedContactSectionTitles)
    },
    [formik, selectedGrade],
  )

  const handleGradeEmojiUpload = useCallback(
    (url: string) => {
      const updatedGradeEmoji = [...formik.values.gradeEmoji]

      updatedGradeEmoji.splice(selectedGrade, 1, url)
      dispatch(updateSurvey({ gradeEmoji: updatedGradeEmoji, id: surveyId }))
    },
    [dispatch, formik.values.gradeEmoji, selectedGrade, surveyId],
  )

  const handleGradeEmojiSelectedUpload = useCallback(
    (url: string) => {
      const updatedGradeEmoji = [...formik.values.gradeEmojiSelected]

      updatedGradeEmoji.splice(selectedGrade, 1, url)
      dispatch(updateSurvey({ gradeEmojiSelected: updatedGradeEmoji, id: surveyId }))
    },
    [dispatch, formik.values.gradeEmojiSelected, selectedGrade, surveyId],
  )

  const handleEvaluationMarkUpload = useCallback(
    (url: string) => {
      dispatch(updateSurvey({ evaluationMark: url, id: surveyId }))
    },
    [dispatch, surveyId],
  )

  const handleEvaluationMarkSelectedUpload = useCallback(
    (url: string) => {
      dispatch(updateSurvey({ evaluationMarkSelected: url, id: surveyId }))
    },
    [dispatch, surveyId],
  )

  return (
    <Form
      title={
        <SubEntityTitle
          title={isCreateMode ? 'New survey' : survey?.title}
          projectTitle={project?.title}
        />
      }
      onDelete={handleDelete}
      onSubmit={formik.handleSubmit}
      onCancel={formik.resetForm}
      isUpdateDisabled={!formik.dirty || pending}
      isDeleteDisabled={isCreateMode}
      className={styles.container}
      additionalControls={
        !isCreateMode ? (
          <CustomButton href={`/#/projects/${projectId}`}>Go to Project</CustomButton>
        ) : null
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
          <FormInput label="Title" name="title" formProps={formik} />
          <FormInput label="Sub title" name="subTitle" formProps={formik} />
          <FormInput multiline label="Description" name="description" formProps={formik} />
          <FormInput label="Ask customers about..." name="surveyTopic" formProps={formik} />
          <div className={styles.formLabel}>Comment section title</div>
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
            value={formik.values.sharingQuestions[selectedGrade] || ''}
            onChange={handleSharingQuestionChange}
            fullWidth={true}
            multiline
          />
          <TextField
            className={styles.contactSectionTitlesInput}
            label={`Grade ${selectedGrade + 1} contact section title`}
            value={formik.values.contactSectionTitles[selectedGrade] || ''}
            onChange={handleContactSectionTitleChange}
            fullWidth={true}
            multiline
          />
          <div className={styles.sectionTitle}>{`Grade ${selectedGrade + 1} emoji`}</div>
          <div className={styles.emojiPreview}>
            <ImageUpload
              width={100}
              height={100}
              backgroundSize={'45px 45px'}
              className={styles.emojiUpload}
              label="normal"
              image={formik.values.gradeEmoji[selectedGrade]}
              imagePath={`surveys/${surveyId}/gradeEmoji`}
              imageName={`grade_${selectedGrade + 1}_emoji`}
              onComplete={handleGradeEmojiUpload}
            />
            <ImageUpload
              width={100}
              height={100}
              backgroundSize={'45px 45px'}
              className={styles.emojiUpload}
              label="selected"
              image={formik.values.gradeEmojiSelected[selectedGrade]}
              imagePath={`surveys/${surveyId}/gradeEmojiSelected`}
              imageName={`grade_${selectedGrade + 1}_emoji`}
              onComplete={handleGradeEmojiSelectedUpload}
            />
          </div>
          <div className={styles.sectionTitle}>Evaluation mark</div>
          <div className={styles.emojiPreview}>
            <ImageUpload
              width={100}
              height={100}
              backgroundSize={'41px 40px'}
              className={styles.evaluationMark}
              label="normal"
              image={formik.values.evaluationMark}
              imagePath={`surveys/${surveyId}/evaluationMark`}
              imageName="normal"
              onComplete={handleEvaluationMarkUpload}
            />
            <ImageUpload
              width={100}
              height={100}
              backgroundSize={'41px 40px'}
              className={styles.evaluationMark}
              label="selected"
              image={formik.values.evaluationMarkSelected}
              imagePath={`surveys/${surveyId}/evaluationMark`}
              imageName="selected"
              onComplete={handleEvaluationMarkSelectedUpload}
            />
          </div>
          <FormInput label="Feedback input label" name="feedbackInputLabel" formProps={formik} />
          <FormInput label="Email input label" name="emailInputLabel" formProps={formik} />
          <FormInput label="Phone input label" name="phoneInputLabel" formProps={formik} />
          <FormInput label="Evaluation label" name="evaluationLabel" formProps={formik} multiline />
          <Accordion className={styles.questionsSection} defaultExpanded={true}>
            <AccordionSummary
              className={styles.questionsSectionSummary}
              expandIcon={<ExpandMoreIcon />}
            >
              Evaluation topics
            </AccordionSummary>
            <AccordionDetails className={styles.questionsSectionDetail}>
              {(formik.values.evaluationTopics as string[]).map(
                (evaluationTopic: string, i: number) => (
                  <EvaluationTopic
                    value={evaluationTopic}
                    index={i}
                    onRemove={handleRemoveQuestion}
                    onChangeText={handleChangeQuestionText}
                    onChangeOrder={handleChangeQuestionOrder}
                    isMoveUpDisabled={i === 0}
                    isMoveDownDisabled={i === formik.values.evaluationTopics?.length - 1}
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
          <FormInput
            multiline
            name="recommendationQuestionText"
            label="Recommendation question text"
            formProps={formik}
          />
          <FormInput label="Submit button text" name="submitButtonText" formProps={formik} />
        </div>
        <SurveyPreview data={survey} grade={selectedGrade} />
      </div>
    </Form>
  )
}
