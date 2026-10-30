import { z } from "zod"

import { dateRangeShape, validateDateRange } from "../types/reports/BaseQuery"
import { TRPR0031_RESULT_CODES } from "../utils/triggerConstants"

const stringResultCodes = TRPR0031_RESULT_CODES.map(String) as string[]

export const CommunitySentenceReportQuerySchema = z
  .object({
    ...dateRangeShape,
    resultCodes: z
      .preprocess((val) => (typeof val === "string" ? [val] : val), z.array(z.enum(stringResultCodes)))
      .optional()
  })
  .superRefine(validateDateRange)

export type CommunitySentenceReportQuery = z.infer<typeof CommunitySentenceReportQuerySchema>
