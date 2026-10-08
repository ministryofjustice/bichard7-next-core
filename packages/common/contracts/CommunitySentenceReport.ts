import { z } from "zod"

import { dateRangeShape, validateDateRange } from "../types/reports/BaseQuery"

export const CommunitySentenceReportQuerySchema = z.object(dateRangeShape).superRefine(validateDateRange)

export type CommunitySentenceReportQuery = z.infer<typeof CommunitySentenceReportQuerySchema>
