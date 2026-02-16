import { z } from "zod"

import { dateLikeToDate } from "../../schemas/dateLikeToDate"
import { CaseSchema } from "../Case"
import { NoteDtoSchema, NoteRowSchema } from "../Note"
import { dateRangeShape, validateDateRange } from "./BaseQuery"

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

export const CaseRowForExceptionReportSchema = z.object({
  asn: z.string(),
  court_date: dateLikeToDate,
  court_name: z.string(),
  court_reference: z.string(),
  court_room: z.string(),
  defendant_name: z.string(),
  msg_received_ts: dateLikeToDate,
  notes: z.array(NoteRowSchema),
  ptiurn: z.string(),
  resolved_ts: dateLikeToDate,
  resolver: z.string(),
  type: z.string()
})

export const CaseForExceptionReportSchema = CaseSchema.pick({
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

export const UserExceptionReportRowSchema = z.object({
  cases: z.array(CaseRowForExceptionReportSchema),
  username: z.string()
})

export const ExceptionReportSchema = z.object({
  cases: z.array(CaseForExceptionReportSchema),
  username: z.string()
})

export type CaseForExceptionReport = z.infer<typeof CaseForExceptionReportSchema>
export type CaseRowForExceptionReport = z.infer<typeof CaseRowForExceptionReportSchema>

export type ExceptionReport = z.infer<typeof ExceptionReportSchema>
export type ExceptionReportQuery = z.infer<typeof ExceptionReportQuerySchema>

export type ExceptionReportType = "Exceptions" | "Triggers"

export type UserExceptionReportRow = z.infer<typeof UserExceptionReportRowSchema>
