export enum SwitchingReason {
  issue = "issue",
  other = "other",
  preference = "preference"
}

export enum Page {
  caseDetails = "Case details",
  caseList = "Case list"
}

export type SurveyFeedbackResponse = { comment: string; experience: number }

export type SwitchingFeedbackResponse =
  | {
      comment?: string
      pageWithIssue?: Page
      switchingReason?: SwitchingReason
    }
  | {
      skipped: boolean
    }

export enum SurveyFeedbackType {
  General = 0,
  Switching = 1
}
