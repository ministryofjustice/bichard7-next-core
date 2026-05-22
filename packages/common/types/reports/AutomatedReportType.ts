export type AutomatedReportType = "automation rate" | "top exceptions"

export type PrettyAutomatedReportType = "Automation rate" | "Top exceptions"

export const AUTOMATED_REPORT_TYPE_MAP: Record<AutomatedReportType, PrettyAutomatedReportType> = {
  "automation rate": "Automation rate",
  "top exceptions": "Top exceptions"
} as const
