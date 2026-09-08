export enum Page {
  caseDetails = "Case details",
  caseList = "Case list"
}

export enum SurveyFeedbackType {
  General = 0,
  Switching = 1
}

export enum SwitchingReason {
  issue = "issue",
  other = "other",
  preference = "preference"
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
