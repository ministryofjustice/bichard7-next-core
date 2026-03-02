import { z } from "zod"

import { dateRangeShape, validateDateRange } from "../types/reports/BaseQuery"

export const ExceptionReportQuerySchema = z
  .object({
    ...dateRangeShape,
    exceptions: z.enum(["true", "false"]).transform((val) => val === "true"),
    triggers: z.enum(["true", "false"]).transform((val) => val === "true")
  })
  .superRefine(validateDateRange)
  .superRefine((data, ctx) => {
    if (!data.triggers && !data.exceptions) {
      const message = "At least one of 'triggers' or 'exceptions' must be selected"

      ctx.addIssue({ code: "custom", message, path: ["triggers"] })
      ctx.addIssue({ code: "custom", message, path: ["exceptions"] })
    }
  })

export type ExceptionReportQuery = z.infer<typeof ExceptionReportQuerySchema>
