import React, { useMemo } from "react";
import { TextField, Button } from "@material-ui/core";

import { Survey } from "typings/entities";
import { ReactComponent as PhotoIcon } from "assets/icons/photo.svg";
import { ReactComponent as AudioIcon } from "assets/icons/audio.svg";

import styles from "./styles.module.scss";

type Props = {
  data?: Survey;
  grade?: number;
};

const DEFAULT_DESIGN = {
  contentBackgroundColor: "#ffffff",
  submitButtonBackgroundColor: "#ffa188",
  submitButtonTextColor: "#ffffff",
};

export default ({ data = {}, grade = 5 }: Props) => {
  const {
    logo,
    title,
    subTitle,
    surveyTopic,
    sharingQuestions,
    contactSectionTitle,
    feedbackInputLabel,
    emailInputLabel,
    phoneInputLabel,
    recommendationQuestionText,
    submitButtonText,
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

  const submitButtonStyles = useMemo(() => {
    const { submitButtonBackgroundColor, submitButtonTextColor } = surveyDesign;

    return {
      backgroundColor: submitButtonBackgroundColor,
      color: submitButtonTextColor,
    };
  }, [surveyDesign]);

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
        <div className={styles.sectionTitle}>{contactSectionTitle}</div>
        <TextField fullWidth={true} label={emailInputLabel} />
        <TextField fullWidth={true} label={phoneInputLabel} />
        <div className={styles.sectionTitle}>{recommendationQuestionText}</div>
        <div className={styles.submitButtonWrapper}>
          <Button className={styles.submitButton} style={submitButtonStyles}>
            {submitButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
};
