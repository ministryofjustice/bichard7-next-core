export type PrettyReportType =
  | "Bail Conditions"
  | "Domestic Violence & Vulnerable Victims"
  | "Resolved Exceptions/Triggers"
  | "Warrants"

export type ReportType = "bails" | "domestic violence" | "exceptions" | "warrants"

export const REPORT_TYPE_MAP: Record<ReportType, PrettyReportType> = {
  bails: "Bail Conditions",
  "domestic violence": "Domestic Violence & Vulnerable Victims",
  exceptions: "Resolved Exceptions/Triggers",
  warrants: "Warrants"
} as const
