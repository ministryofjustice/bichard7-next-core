import z from "zod"

export const exceptionQualityValues = {
  "Manual Disposal Fail": 6,
  "Not Checked": 1,
  "Remand Pass": 7,
  "Report Fail": 8
} as const

export const ExceptionQualitySchema = z.union(Object.values(exceptionQualityValues).map((value) => z.literal(value)))

export type ExceptionQuality = z.infer<typeof ExceptionQualitySchema>
