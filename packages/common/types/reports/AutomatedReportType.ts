export type AutomatedReportType = "automation rate" | "top exceptions"

export type PrettyAutomatedReportType = "Automation Rate" | "Top Exceptions"

export const AUTOMATED_REPORT_TYPE_MAP: Record<AutomatedReportType, PrettyAutomatedReportType> = {
  "automation rate": "Automation Rate",
  "top exceptions": "Top Exceptions"
} as const
