export type ReportType = "exceptions" | "bails" | "warrants" | "domestic violence"

export type PrettyReportType =
  | "Bail Conditions"
  | "Domestic Violence & Vulnerable Victims"
  | "Resolved Exceptions/Triggers"
  | "Warrants"

export const REPORT_TYPE_MAP: Record<ReportType, PrettyReportType> = {
  bails: "Bail Conditions",
  "domestic violence": "Domestic Violence & Vulnerable Victims",
  exceptions: "Resolved Exceptions/Triggers",
  warrants: "Warrants"
} as const
