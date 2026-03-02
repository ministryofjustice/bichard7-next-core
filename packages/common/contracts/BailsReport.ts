import { z } from "zod"

import { dateRangeShape, validateDateRange } from "../types/reports/BaseQuery"

export const BailsReportQuerySchema = z.object(dateRangeShape).superRefine(validateDateRange)

export type BailsReportQuery = z.infer<typeof BailsReportQuerySchema>
