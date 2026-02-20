import type z from "zod"

import { dateLikeToDate } from "@moj-bichard7/common/schemas/dateLikeToDate"
import { CaseRowSchema } from "@moj-bichard7/common/types/Case"
import { TriggerRowSchema } from "@moj-bichard7/common/types/Trigger"

export const CaseRowForBailsReportSchema = CaseRowSchema.pick({
  annotated_msg: true,
  asn: true,
  court_name: true,
  defendant_name: true,
  error_count: true,
  error_id: true,
  msg_received_ts: true,
  ptiurn: true
}).extend({
  court_date: dateLikeToDate,
  triggers: TriggerRowSchema.array()
})

export type CaseRowForBailsReport = z.infer<typeof CaseRowForBailsReportSchema>
