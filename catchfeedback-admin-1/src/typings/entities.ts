export enum ROLES {
  ADMIN = 'admin',
}

export type AuthUser = {
  uid: string
  name: string | null
  email: string | null
}

export type Project = {
  id: string
  title: string
  description: string
  promoId: string
  surveyId: string
}

export type ProjectSubEntity = {
  id?: string
  projectId?: string
}

export type Promotion = ProjectSubEntity & {
  isActive?: boolean
  title: string
  description?: string
  image?: string
  shareImage?: string
}

export type SurveyDesign = {
  theme: string
  headerBackgroundImage?: string
  headerBackgroundColor?: string
  headerTextColor?: string
  contentBackgroundColor?: string
  contentTextColor?: string
  controlsBackgroundColor?: string
  controlsTextColor?: string
  inputsPlaceholderColor?: string
  gradeEmoji?: string[]
  gradeEmojiSelected?: string[]
  evaluationMark?: string
  evaluationMarkSelected?: string
  evaluationSectionBackgroundColor?: string
  evaluationSectionTextColor?: string
  shareAudioIcon?: string
  sharePhotoIcon?: string
}

export type Survey = ProjectSubEntity & {
  logo?: string
  title?: string
  subTitle?: string
  surveyTopic?: string
  responseTextGrade1?: string
  responseTextGrade2?: string
  responseTextGrade3?: string
  responseTextGrade4?: string
  responseTextGrade5?: string
  recommendationQuestionText?: string
  submitButtonText?: string
  evaluationLabel?: string
  evaluationTopics?: string[]
  sharingQuestions?: string[]
  contactSectionTitles?: string[]
  feedbackInputLabel?: string
  emailInputLabel?: string
  phoneInputLabel?: string
  content?: any
  // content: Record<string, any>
  design?: SurveyDesign
}
