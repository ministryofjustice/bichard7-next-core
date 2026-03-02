import z from "zod"

import { dateRangeShape, validateDateRange } from "../types/reports/BaseQuery"

export const WarrantsReportQuerySchema = z.object(dateRangeShape).superRefine(validateDateRange)

export type WarrantsReportQuery = z.infer<typeof WarrantsReportQuerySchema>
