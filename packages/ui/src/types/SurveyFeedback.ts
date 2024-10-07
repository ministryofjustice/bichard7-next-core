export enum SwitchingReason {
  issue = "issue",
  preference = "preference",
  other = "other"
}

export enum Page {
  caseList = "Case list",
  caseDetails = "Case details"
}

export type SurveyFeedbackResponse = { experience: number; comment: string }

export type SwitchingFeedbackResponse =
  | {
      switchingReason?: SwitchingReason
      pageWithIssue?: Page
      comment?: string
    }
  | {
      skipped: boolean
    }

export enum SurveyFeedbackType {
  General = 0,
  Switching = 1
}
