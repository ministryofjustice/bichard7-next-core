export type PrettyReportType =
  | "Bail Conditions"
  | "Domestic Violence & Vulnerable Victims"
  | "Resolved Exceptions/Triggers"
  | "User Performance Summary"
  | "Warrants"

export type ReportType = "bails" | "domestic violence" | "exceptions" | "user summary" | "warrants"

export const REPORT_TYPE_MAP: { [K in ReportType]?: PrettyReportType } = {
  bails: "Bail Conditions",
  "domestic violence": "Domestic Violence & Vulnerable Victims",
  exceptions: "Resolved Exceptions/Triggers",
  warrants: "Warrants"
} as const
