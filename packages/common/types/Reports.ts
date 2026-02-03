import { z } from "zod"

import { dateLikeToDate } from "../schemas/dateLikeToDate"

export const BaseReportQuerySchema = z.object({
  fromDate: dateLikeToDate,
  toDate: dateLikeToDate
})

export type ExceptionReportType = "Exceptions" | "Triggers"

export const ExceptionReportQuerySchema = BaseReportQuerySchema.extend({
  exceptions: z.enum(["true", "false"]).transform((val) => val === "true"),
  triggers: z.enum(["true", "false"]).transform((val) => val === "true")
})

export type ExceptionReportQuery = z.infer<typeof ExceptionReportQuerySchema>
