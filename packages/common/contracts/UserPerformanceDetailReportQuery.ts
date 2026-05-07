import z from "zod"

import { dateRangeShape, validateDateRange } from "../types/reports/BaseQuery"

export const UserPerformanceDetailReportQuerySchema = z.object(dateRangeShape).superRefine(validateDateRange)

export type UserPerformanceDetailReportQuery = z.infer<typeof UserPerformanceDetailReportQuerySchema>
