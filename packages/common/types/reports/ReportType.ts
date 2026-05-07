export type PrettyReportType =
  | "Bail Conditions"
  | "Domestic Violence & Vulnerable Victims"
  | "Resolved Exceptions/Triggers"
  | "User Performance Summary"
  | "Warrants"

export type ReportType = "bails" | "domestic violence" | "exceptions" | "user summary" | "warrants"

export const REPORT_TYPE_MAP: Record<ReportType, PrettyReportType> = {
  bails: "Bail Conditions",
  "domestic violence": "Domestic Violence & Vulnerable Victims",
  exceptions: "Resolved Exceptions/Triggers",
  "user summary": "User Performance Summary",
  warrants: "Warrants"
} as const
