import type z from "zod"

import { dateLikeToDate } from "@moj-bichard7/common/schemas/dateLikeToDate"
import { CaseRowSchema } from "@moj-bichard7/common/types/Case"
import { TriggerRowSchema } from "@moj-bichard7/common/types/Trigger"

export const CommunitySentenceRowReportSchema = CaseRowSchema.pick({
  annotated_msg: true,
  defendant_name: true,
  error_id: true,
  msg_received_ts: true
}).extend({
  court_date: dateLikeToDate,
  triggers: TriggerRowSchema.array()
})

export type CommunitySentenceRowReport = z.infer<typeof CommunitySentenceRowReportSchema>
