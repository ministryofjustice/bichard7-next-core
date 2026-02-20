import { CaseRowSchema } from "@moj-bichard7/common/types/Case"
import z from "zod"

export const CaseRowForDomesticViolenceReportSchema = CaseRowSchema.pick({
  annotated_msg: true,
  asn: true,
  court_date: true,
  court_name: true,
  defendant_name: true,
  error_count: true,
  error_id: true,
  msg_received_ts: true,
  ptiurn: true
}).extend({
  trigger_codes: z.string().array()
})

export type CaseRowForDomesticViolenceReport = z.infer<typeof CaseRowForDomesticViolenceReportSchema>
