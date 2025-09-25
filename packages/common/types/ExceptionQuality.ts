import z from "zod"

export const exceptionQualityValues = {
  1: "Not Checked",
  6: "Manual Disposal Fail",
  7: "Remand Pass",
  8: "Report Fail"
} as const

const exceptionQualityKeys = Object.keys(exceptionQualityValues).map(Number) as (keyof typeof exceptionQualityValues)[]

export const ExceptionQualitySchema = z.union(exceptionQualityKeys.map((value) => z.literal(value)))

export type ExceptionQuality = z.infer<typeof ExceptionQualitySchema>
