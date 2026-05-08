import z from "zod"

import { dateRangeShape, validateDateRange } from "../types/reports/BaseQuery"

export const UserSummaryReportQuerySchema = z.object(dateRangeShape).superRefine(validateDateRange)

export type UserSummaryReportQuery = z.infer<typeof UserSummaryReportQuerySchema>
