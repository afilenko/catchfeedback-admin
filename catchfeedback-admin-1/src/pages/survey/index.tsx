import React, { useMemo, useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { object, string } from "yup";
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import {
  surveysSelector,
  isPendingSurveysSelector,
} from "store/surveys/selectors";
import {
  fetchSurvey,
  createSurvey,
  updateSurvey,
  deleteSurvey,
} from "store/surveys/actions";
import SubEntityTitle from "components/sub-entity-title";
import FormInput from "components/form-input";
import ImageUpload from "components/image-upload";
import CustomButton from "components/custom-button";
import Form from "components/form";
import useProject from "hooks/useProject";
import SurveyQuestion from "./SurveyQuestion";
import SurveyPreview from "components/survey-preview";

import styles from "./styles.module.scss";

const VALIDATION_SCHEMA = object({
  title: string().required("This field is required"),
});

const GRADES = [0, 1, 2, 3, 4];

const INITIAL_VALUES = {
  title: "",
  description: "",
  questions: [],
  sharingQuestions: GRADES.map(() => ""),
  contactSectionTitle: "",
};

export default () => {
  const dispatch = useDispatch();
  const { projectId, surveyId } = useParams<any>();
  const surveys = useSelector(surveysSelector);
  const pending = useSelector(isPendingSurveysSelector);
  const project = useProject();
  const [selectedGrade, setSelectedGrade] = useState(GRADES.length - 1);
  const isCreateMode = surveyId === "new";

  useEffect(() => {
    dispatch(fetchSurvey(projectId));
  }, [dispatch, projectId]);

  const handleSave = async () => {
    if (isCreateMode) {
      dispatch(createSurvey({ ...formik.values, projectId }));
    } else {
      dispatch(updateSurvey({ ...formik.values, id: surveyId }));
    }
  };

  const handleDelete = () => {
    dispatch(deleteSurvey({ id: surveyId, projectId }));
  };

  const survey = useMemo(() => {
    return surveys && surveys.find(({ id }) => id === surveyId);
  }, [surveyId, surveys]);

  const formik = useFormik({
    initialValues: { ...INITIAL_VALUES, ...survey },
    validationSchema: VALIDATION_SCHEMA,
    enableReinitialize: true,
    onSubmit: handleSave,
  });

  const handleRemoveQuestion = (index: number) => {
    const updatedQuestions = [...formik.values.questions];

    updatedQuestions.splice(index, 1);
    formik.setFieldValue("questions", updatedQuestions);
  };

  const handleChangeQuestionText = (value: string, index: number) => {
    const updatedQuestions = [...formik.values.questions];

    updatedQuestions.splice(index, 1, value);
    formik.setFieldValue("questions", updatedQuestions);
  };

  const handleChangeQuestionOrder = (direction: number, index: number) => {
    const updatedQuestions = [...formik.values.questions];
    const indexToSwap = index + direction;
    const valueToSwap = updatedQuestions[indexToSwap];

    updatedQuestions.splice(indexToSwap, 1, updatedQuestions[index]);
    updatedQuestions.splice(index, 1, valueToSwap);
    formik.setFieldValue("questions", updatedQuestions);

    console.log({ direction, index, indexToInsert: indexToSwap });
  };

  const handleAddQuestion = () => {
    formik.setFieldValue("questions", [...formik.values.questions, ""]);
  };

  const handleSharingQuestionChange = useCallback(
    ({ target }: any) => {
      const updatedQuestions = [...formik.values.sharingQuestions];

      updatedQuestions.splice(selectedGrade, 1, target?.value);
      formik.setFieldValue("sharingQuestions", updatedQuestions);
    },
    [formik, selectedGrade]
  );

  return (
    <Form
      title={
        <SubEntityTitle
          title={isCreateMode ? "New survey" : survey?.title}
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
          <CustomButton href={`/#/projects/${projectId}`}>
            Go to Project
          </CustomButton>
        ) : null
      }
    >
      <div className={styles.inputsColumn}>
        <ImageUpload
          label="Logo"
          image={survey?.logo}
          imagePath={`surveys/${surveyId}`}
          imageName="logo"
          onComplete={(url) =>
            dispatch(updateSurvey({ logo: url, id: surveyId }))
          }
        />
        <FormInput label="Title" name="title" formProps={formik} />
        <FormInput label="Sub title" name="subTitle" formProps={formik} />
        <FormInput
          multiline
          label="Description"
          name="description"
          formProps={formik}
        />
        <FormInput
          label="Ask customers about..."
          name="surveyTopic"
          formProps={formik}
        />
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
              label={grade}
              labelPlacement="top"
              control={<Radio color="default" />}
              classes={{ labelPlacementTop: styles.grade }}
            />
          ))}
        </RadioGroup>
        <TextField
          className={styles.sharingQuestionsInput}
          label={`Grade ${selectedGrade + 1} response text`}
          value={formik.values.sharingQuestions[selectedGrade] || ""}
          onChange={handleSharingQuestionChange}
          fullWidth={true}
          multiline
        />
        <FormInput
          label="Feedback input label"
          name="feedbackInputLabel"
          formProps={formik}
        />
        <FormInput
          label="Email input label"
          name="emailInputLabel"
          formProps={formik}
        />
        <FormInput
          label="Phone input label"
          name="phoneInputLabel"
          formProps={formik}
        />
        <FormInput
          label="Contact section title"
          name="contactSectionTitle"
          formProps={formik}
        />
        <Accordion className={styles.questionsSection} defaultExpanded={true}>
          <AccordionSummary
            className={styles.questionsSectionSummary}
            expandIcon={<ExpandMoreIcon />}
          >
            Questions
          </AccordionSummary>
          <AccordionDetails className={styles.questionsSectionDetail}>
            {(formik.values.questions as string[]).map(
              (question: string, i: number) => (
                <SurveyQuestion
                  value={question}
                  index={i}
                  onRemove={handleRemoveQuestion}
                  onChangeText={handleChangeQuestionText}
                  onChangeOrder={handleChangeQuestionOrder}
                  isMoveUpDisabled={i === 0}
                  isMoveDownDisabled={i === formik.values.questions?.length - 1}
                />
              )
            )}
            <div>
              <CustomButton
                onClick={handleAddQuestion}
                className={styles.addQuestionButton}
                buttonColor="green"
              >
                Add question
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
        <FormInput
          label="Submit button text"
          name="submitButtonText"
          formProps={formik}
        />
      </div>
      <SurveyPreview data={survey} grade={selectedGrade} />
    </Form>
  );
};
