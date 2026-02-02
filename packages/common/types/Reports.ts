import { z } from "zod"

import { dateLikeToDate } from "../schemas/dateLikeToDate"

export const BaseReportQuerySchema = z.object({
  fromDate: dateLikeToDate,
  toDate: dateLikeToDate
})

export const ExceptionReportQuerySchema = BaseReportQuerySchema.extend({
  exceptions: z.coerce.boolean(),
  triggers: z.coerce.boolean()
})

export type ExceptionReportQuery = z.infer<typeof ExceptionReportQuerySchema>
