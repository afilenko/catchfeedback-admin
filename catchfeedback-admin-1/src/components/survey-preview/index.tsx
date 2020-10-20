import React, { useMemo, useState } from "react";
import { TextField, Button, Slider, Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";

import { Survey } from "typings/entities";
import { ReactComponent as PhotoIcon } from "assets/icons/photo.svg";
import { ReactComponent as AudioIcon } from "assets/icons/audio.svg";
import IconToggle from "./IconToggle";

import styles from "./styles.module.scss";

type Props = {
  data?: Survey;
  grade?: number;
};

const DEFAULT_DESIGN = {
  contentBackgroundColor: "#ffffff",
  submitButtonBackgroundColor: "#ffa188",
  submitButtonTextColor: "#ffffff",
  evaluationSectionBackgroundColor: "#f3f6fa",
};

const ValueLabelComponent = ({ children, open, value }: any) => (
  <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
    {children}
  </Tooltip>
);

const StyledSlider = withStyles({
  root: {
    color: "#ffa188",
    marginTop: 30,
    marginBottom: 30,
  },
  thumb: {
    height: 40,
    width: 40,
    marginTop: -20,
    marginLeft: -20,
    "&:focus, &:hover, &$active": {
      boxShadow: "none",
    },
  },
  active: {},
  valueLabel: {
    left: 4,
  },
  markLabel: {
    marginTop: 2,
    fontSize: 18,
    color: "#757575",
  },
})(Slider);

export default ({
  data = { gradeEmoji: [], gradeEmojiSelected: [] },
  grade = 5,
}: Props) => {
  const {
    logo,
    title,
    subTitle,
    surveyTopic,
    gradeEmoji,
    gradeEmojiSelected,
    sharingQuestions,
    contactSectionTitles,
    feedbackInputLabel,
    emailInputLabel,
    phoneInputLabel,
    evaluationLabel,
    evaluationTopics,
    recommendationQuestionText,
    submitButtonText,
    evaluationMark,
    evaluationMarkSelected,
    design,
  } = data;

  const surveyDesign: typeof design = useMemo(
    () => ({ ...DEFAULT_DESIGN, ...design }),
    [design]
  );

  const headerStyles = useMemo(() => {
    const { headerBackgroundImage, headerBackgroundColor } = surveyDesign;

    return {
      backgroundImage: `url(${headerBackgroundImage})`,
      backgroundColor: headerBackgroundColor,
    };
  }, [surveyDesign]);

  const contentStyles = useMemo(() => {
    const { contentBackgroundColor } = surveyDesign;

    return {
      backgroundColor: contentBackgroundColor,
    };
  }, [surveyDesign]);

  const evaluationSectionStyle = useMemo(() => {
    const { evaluationSectionBackgroundColor } = surveyDesign;

    return { backgroundColor: evaluationSectionBackgroundColor };
  }, [surveyDesign]);

  const submitButtonStyles = useMemo(() => {
    const { submitButtonBackgroundColor, submitButtonTextColor } = surveyDesign;

    return {
      backgroundColor: submitButtonBackgroundColor,
      color: submitButtonTextColor,
    };
  }, [surveyDesign]);

  const [evaluation, setEvaluation] = useState<Record<string, number>>({});

  return (
    <div className={styles.container}>
      <div className={styles.header} style={headerStyles}>
        {logo ? (
          <img className={styles.logo} src={logo} alt={title} />
        ) : (
          <div className={styles.logo} />
        )}
        <div className={styles.title}>{title}</div>
        <div className={styles.subTitle}>{subTitle}</div>
      </div>
      <div style={contentStyles} className={styles.content}>
        <div className={styles.sectionTitle}>{surveyTopic}</div>
        <div className={styles.emojiRow}>
          {gradeEmoji.map((url, i) => (
            <IconToggle
              width={45}
              height={45}
              normalStateURL={url}
              selectedStateURL={gradeEmojiSelected[i]}
              selected={grade === i}
            />
          ))}
        </div>

        <div className={styles.sectionTitle}>
          {sharingQuestions ? sharingQuestions[grade] : ""}
        </div>
        <TextField multiline fullWidth={true} label={feedbackInputLabel} />
        <div className={styles.uploadControlsWrapper}>
          <span className={styles.uploadControl}>
            <AudioIcon />
            <span className={styles.uploadControlsLabel}>ADD AUDIO</span>
          </span>
          <span className={styles.uploadControl}>
            <PhotoIcon />
            <span className={styles.uploadControlsLabel}>ADD PHOTO</span>
          </span>
        </div>
        <div className={styles.sectionTitle}>
          {contactSectionTitles ? contactSectionTitles[grade] : ""}
        </div>
        <TextField fullWidth={true} label={emailInputLabel} />
        <TextField fullWidth={true} label={phoneInputLabel} />
        <div className={styles.sectionTitle}>{evaluationLabel}</div>
        {evaluationTopics?.map((evaluationTopic) => (
          <div
            className={styles.evaluationSection}
            style={evaluationSectionStyle}
          >
            <div className={styles.evaluationTopic}>{evaluationTopic}</div>
            <div className={styles.evaluationMarksRow}>
              {[1, 2, 3, 4, 5].map((evaluationGrade) => (
                <IconToggle
                  width={41}
                  height={40}
                  normalStateURL={evaluationMark}
                  selectedStateURL={evaluationMarkSelected}
                  onClick={() =>
                    setEvaluation({
                      ...evaluation,
                      [evaluationTopic]: evaluationGrade,
                    })
                  }
                  selected={evaluation[evaluationTopic] >= evaluationGrade}
                />
              ))}
            </div>
          </div>
        ))}
        <div className={styles.sectionTitle}>{recommendationQuestionText}</div>
        <StyledSlider
          min={0}
          max={10}
          defaultValue={5}
          marks={[
            {
              value: 0,
              label: "0",
            },
            {
              value: 10,
              label: "10",
            },
          ]}
          valueLabelDisplay="on"
        />
        <div className={styles.submitButtonWrapper}>
          <Button className={styles.submitButton} style={submitButtonStyles}>
            {submitButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
};
