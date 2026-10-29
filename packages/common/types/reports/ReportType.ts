export type PrettyReportType =
  | "Bail conditions"
  | "Community sentence"
  | "Domestic violence and vulnerable victims"
  | "Resolved exceptions and triggers"
  | "User performance detail"
  | "User performance summary"
  | "Warrants"

export type ReportType =
  "bails" | "community sentence" | "domestic violence" | "exceptions" | "user detail" | "user summary" | "warrants"

export const REPORT_TYPE_MAP: { [K in ReportType]?: PrettyReportType } = {
  bails: "Bail conditions",
  "community sentence": "Community sentence",
  "domestic violence": "Domestic violence and vulnerable victims",
  exceptions: "Resolved exceptions and triggers",
  "user detail": "User performance detail",
  "user summary": "User performance summary",
  warrants: "Warrants"
} as const
