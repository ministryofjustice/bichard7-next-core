import z from "zod"

import { dateRangeShape, validateDateRange } from "../types/reports/BaseQuery"

export const DomesticViolenceReportQuerySchema = z.object(dateRangeShape).superRefine(validateDateRange)

export type DomesticViolenceReportQuery = z.infer<typeof DomesticViolenceReportQuerySchema>
