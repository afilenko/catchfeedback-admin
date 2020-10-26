/* eslint-disable jsx-a11y/alt-text */
import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { TextField, Button, Slider } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
// @ts-ignore
import { Scrollbars } from 'react-custom-scrollbars'

import { Survey } from 'typings/entities'
import IconToggle from './IconToggle'
import { GRADES } from 'helpers/constants'
import { surveyLocaleSelector } from 'store/surveys/selectors'
import styles from './styles.module.scss'

const DEFAULT_DESIGN = {
  theme: 'custom',
  contentBackgroundColor: '#ffffff',
  controlsBackgroundColor: '#ffa188',
  controlsTextColor: '#ffffff',
  evaluationSectionBackgroundColor: '#f3f6fa',
  gradeEmoji: GRADES.map(() => ''),
  gradeEmojiSelected: GRADES.map(() => ''),
}
const getSliderTheme = (backgroundColor?: string, textColor?: string) =>
  createMuiTheme({
    overrides: {
      MuiSlider: {
        root: {
          color: backgroundColor,
          marginTop: 30,
        },
        thumb: {
          height: 40,
          width: 40,
          marginTop: -20,
          marginLeft: -20,
          '&:focus, &:hover, &$active': {
            boxShadow: 'none',
          },
        },
        active: {},
        valueLabel: {
          left: 4,
        },
        markLabelActive: {
          color: textColor,
        },
        markLabel: {
          marginTop: 4,
          fontSize: 18,
          color: textColor,
        },
      },
    },
  })

const DEFAULT_WIDTH = 320
const DEFAULT_HEIGHT = 570
const HORIZONTAL_PADDING = 25
const SLIDER_MAX = 10

type Props = {
  data?: Survey
  grade?: number
  width?: number
  height?: number
}

export default ({
  data = {} as Survey,
  grade = 5,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
}: Props) => {
  const { logo, design, content = {} } = data
  const locale = useSelector(surveyLocaleSelector)

  const {
    title,
    subTitle,
    surveyTopic,
    sharingQuestions,
    contactSectionTitles,
    feedbackInputLabel,
    emailInputLabel,
    phoneInputLabel,
    evaluationLabel,
    evaluationTopics,
    recommendationQuestionText,
    submitButtonText,
  } = content[locale] || {}

  const surveyDesign: typeof design = useMemo(() => ({ ...DEFAULT_DESIGN, ...design }), [design])

  const {
    evaluationMark,
    evaluationMarkSelected,
    gradeEmoji,
    gradeEmojiSelected,
    shareAudioIcon,
    sharePhotoIcon,
  } = surveyDesign

  const {
    headerBackgroundImage,
    headerBackgroundColor,
    headerTextColor,
    contentBackgroundColor,
    contentTextColor,
    evaluationSectionBackgroundColor,
    evaluationSectionTextColor,
    inputsPlaceholderColor,
    controlsBackgroundColor,
    controlsTextColor,
  } = surveyDesign

  const headerStyles = useMemo(
    () => ({
      backgroundImage: `url(${headerBackgroundImage})`,
      backgroundColor: headerBackgroundColor,
      color: headerTextColor,
    }),
    [headerBackgroundColor, headerBackgroundImage, headerTextColor],
  )

  const contentStyles = useMemo(
    () => ({
      backgroundColor: contentBackgroundColor,
      color: contentTextColor,
    }),
    [contentBackgroundColor, contentTextColor],
  )

  const evaluationSectionStyle = useMemo(
    () => ({
      backgroundColor: evaluationSectionBackgroundColor,
      color: evaluationSectionTextColor,
    }),
    [evaluationSectionBackgroundColor, evaluationSectionTextColor],
  )

  const submitButtonStyles = useMemo(
    () => ({
      backgroundColor: controlsBackgroundColor,
      color: controlsTextColor,
    }),
    [controlsBackgroundColor, controlsTextColor],
  )

  const inputsPlaceholderStyles = useMemo(
    () => ({
      color: inputsPlaceholderColor,
    }),
    [inputsPlaceholderColor],
  )

  const sliderTheme = useMemo(() => getSliderTheme(controlsBackgroundColor, contentTextColor), [
    controlsBackgroundColor,
    contentTextColor,
  ])

  const [evaluation, setEvaluation] = useState<Record<string, number>>({})
  const [sliderValue, setSliderValue] = useState(5)

  const sliderValueLabelStyles = useMemo(
    () => ({
      left: (sliderValue / SLIDER_MAX) * (width - HORIZONTAL_PADDING * 2),
      backgroundColor: controlsBackgroundColor,
      color: controlsTextColor,
    }),
    [sliderValue, controlsBackgroundColor, controlsTextColor, width],
  )

  return (
    <div className={styles.container}>
      <Scrollbars style={{ width, height }}>
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
            {gradeEmoji?.map((url, i) => (
              <IconToggle
                key={`emoji-${i}`}
                width={45}
                height={45}
                normalStateURL={url}
                selectedStateURL={gradeEmojiSelected ? gradeEmojiSelected[i] : ''}
                selected={grade === i}
              />
            ))}
          </div>
          <div className={styles.sectionTitle}>
            {sharingQuestions ? sharingQuestions[grade] : ''}
          </div>
          <TextField
            multiline
            fullWidth={true}
            label={feedbackInputLabel}
            InputLabelProps={{ style: inputsPlaceholderStyles }}
          />
          <div className={styles.uploadControlsWrapper}>
            <span className={styles.uploadControl}>
              {shareAudioIcon ? (
                <img key={shareAudioIcon} src={shareAudioIcon} className={styles.shareIcon} />
              ) : null}
              <span className={styles.uploadControlsLabel} style={inputsPlaceholderStyles}>
                ADD AUDIO
              </span>
            </span>
            <span className={styles.uploadControl}>
              {sharePhotoIcon ? (
                <img key={sharePhotoIcon} src={sharePhotoIcon} className={styles.shareIcon} />
              ) : null}
              <span className={styles.uploadControlsLabel} style={inputsPlaceholderStyles}>
                ADD PHOTO
              </span>
            </span>
          </div>
          <div className={styles.sectionTitle}>
            {contactSectionTitles ? contactSectionTitles[grade] : ''}
          </div>
          <TextField
            fullWidth={true}
            label={emailInputLabel}
            InputLabelProps={{ style: inputsPlaceholderStyles }}
          />
          <TextField
            fullWidth={true}
            label={phoneInputLabel}
            InputLabelProps={{ style: inputsPlaceholderStyles }}
          />
          <div className={styles.sectionTitle}>{evaluationLabel}</div>
          {evaluationTopics?.map((evaluationTopic: string) => (
            <div
              key={evaluationTopic}
              className={styles.evaluationSection}
              style={evaluationSectionStyle}
            >
              <div className={styles.evaluationTopic}>{evaluationTopic}</div>
              <div className={styles.evaluationMarksRow}>
                {[1, 2, 3, 4, 5].map((evaluationGrade) => (
                  <IconToggle
                    key={`${evaluationMark}-${evaluationTopic}-${evaluationGrade}`}
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
          <div className={styles.sliderWrapper}>
            <div className={styles.sliderValueLabel} style={sliderValueLabelStyles}>
              {sliderValue}
            </div>
            <ThemeProvider theme={sliderTheme}>
              <Slider
                min={0}
                max={SLIDER_MAX}
                defaultValue={5}
                value={sliderValue}
                onChange={(event: any, value: any) => setSliderValue(value as number)}
                marks={[
                  {
                    value: 0,
                    label: '0',
                  },
                  {
                    value: 10,
                    label: '10',
                  },
                ]}
              />
            </ThemeProvider>
          </div>

          <div className={styles.submitButtonWrapper}>
            <Button className={styles.submitButton} style={submitButtonStyles}>
              {submitButtonText}
            </Button>
          </div>
        </div>
      </Scrollbars>
    </div>
  )
}
