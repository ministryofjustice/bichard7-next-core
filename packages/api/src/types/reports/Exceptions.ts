import { dateLikeToDate } from "@moj-bichard7/common/schemas/dateLikeToDate"
import { NoteRowSchema } from "@moj-bichard7/common/types/Note"
import z from "zod"

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

export const UserExceptionReportRowSchema = z.object({
  cases: z.array(CaseRowForExceptionReportSchema),
  username: z.string()
})

export type CaseRowForExceptionReport = z.infer<typeof CaseRowForExceptionReportSchema>
export type UserExceptionReportRow = z.infer<typeof UserExceptionReportRowSchema>
