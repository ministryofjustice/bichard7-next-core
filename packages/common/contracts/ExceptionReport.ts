import { z } from "zod"

import { dateLikeToDate } from "../schemas/dateLikeToDate"
import { CaseSchema } from "../types/Case"
import { NoteDtoSchema } from "../types/Note"
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

export const CaseForExceptionReportDtoSchema = CaseSchema.pick({
  asn: true,
  courtName: true,
  courtReference: true,
  courtRoom: true,
  defendantName: true,
  messageReceivedAt: true,
  notes: true,
  ptiurn: true
}).extend({
  hearingDate: dateLikeToDate,
  notes: z.array(NoteDtoSchema),
  resolvedAt: dateLikeToDate,
  resolver: z.string(),
  type: z.string()
})

export const ExceptionReportDtoSchema = z.object({
  cases: z.array(CaseForExceptionReportDtoSchema),
  username: z.string()
})

export type CaseForExceptionReportDto = z.infer<typeof CaseForExceptionReportDtoSchema>

export type ExceptionReportDto = z.infer<typeof ExceptionReportDtoSchema>
export type ExceptionReportQuery = z.infer<typeof ExceptionReportQuerySchema>

export type ExceptionReportType = "Exceptions" | "Triggers"
