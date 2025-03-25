export const pncErrorsFilePath = "scripts/analytics/pnc-errors-report/pnc-errors.json"
export const pncErrorsAnalysisFilePath = "scripts/analytics/pnc-errors-report/pnc-errors-analysis.json"

export const getDateString = (date: string | Date) =>
  (typeof date === "object" ? date.toISOString() : date).split("T")[0]
