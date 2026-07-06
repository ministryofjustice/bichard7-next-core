import { dateLikeToDate } from "@moj-bichard7/common/schemas/dateLikeToDate"
import { NoteRowSchema } from "@moj-bichard7/common/types/Note"
import z from "zod"

export const ExceptionOrTriggerSchema = z.enum(["Exception", "Trigger"])

export const CaseRowForExceptionReportSchema = z.object({
  asn: z.string(),
  court_date: dateLikeToDate,
  court_name: z.string(),
  court_reference: z.string(),
  court_room: z.string(),
  defendant_name: z.string(),
  error_id: z.number(),
  msg_received_ts: dateLikeToDate,
  notes: z.array(NoteRowSchema),
  ptiurn: z.string(),
  resolved_ts: dateLikeToDate,
  resolver: z.string(),
  type: ExceptionOrTriggerSchema
})

export const UserExceptionReportRowSchema = z.object({
  cases: z.array(CaseRowForExceptionReportSchema),
  full_name: z.string().nullable(),
  username: z.string()
})

export type CaseRowForExceptionReport = z.infer<typeof CaseRowForExceptionReportSchema>
export type ExceptionOrTrigger = z.infer<typeof ExceptionOrTriggerSchema>
export type UserExceptionReportRow = z.infer<typeof UserExceptionReportRowSchema>

export const CASE_TYPES = ExceptionOrTriggerSchema.enum
