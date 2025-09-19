export const exceptionQualityValues = {
  1: "Not Checked",
  6: "Manual Disposal Fail",
  7: "Remand Pass",
  8: "Report Fail"
} as const

export type ExceptionQuality = keyof typeof exceptionQualityValues
