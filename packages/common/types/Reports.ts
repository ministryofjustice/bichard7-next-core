import { isAfter, isBefore } from "date-fns"
import { z } from "zod"

import { dateLikeToDate } from "../schemas/dateLikeToDate"
import { CaseSchema } from "./Case"
import { NoteDtoSchema, NoteRowSchema } from "./Note"

export const ExceptionReportQuerySchema = z
  .object({
    exceptions: z.enum(["true", "false"]).transform((val) => val === "true"),
    fromDate: dateLikeToDate,
    toDate: dateLikeToDate,
    triggers: z.enum(["true", "false"]).transform((val) => val === "true")
  })
  .superRefine((data, ctx) => {
    if (isBefore(data.toDate, data.fromDate) || isAfter(data.toDate, new Date())) {
      ctx.addIssue({
        code: "custom",
        input: {
          fromDate: data.fromDate,
          toDate: data.toDate
        },
        message: "Date range cannot be in the future"
      })
    }

    if (!data.triggers && !data.exceptions) {
      const message = "At least one of 'triggers' or 'exceptions' must be selected"

      ctx.addIssue({
        code: "custom",
        message,
        path: ["triggers"]
      })

      ctx.addIssue({
        code: "custom",
        message,
        path: ["exceptions"]
      })
    }
  })

export const CaseRowForReportSchema = z.object({
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

export const CaseForReportSchema = CaseSchema.pick({
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

export const UserReportRowSchema = z.object({
  cases: z.array(CaseRowForReportSchema),
  username: z.string()
})

export const ExceptionReportSchema = z.object({
  cases: z.array(CaseForReportSchema),
  username: z.string()
})

export type CaseForReport = z.infer<typeof CaseForReportSchema>
export type CaseRowForReport = z.infer<typeof CaseRowForReportSchema>

export type ExceptionReport = z.infer<typeof ExceptionReportSchema>
export type ExceptionReportQuery = z.infer<typeof ExceptionReportQuerySchema>

export type ExceptionReportType = "Exceptions" | "Triggers"

export type UserReportRow = z.infer<typeof UserReportRowSchema>
