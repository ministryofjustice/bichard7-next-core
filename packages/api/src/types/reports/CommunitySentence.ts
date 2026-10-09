import type z from "zod"

import { CaseRowSchema } from "@moj-bichard7/common/types/Case"
import zod from "zod"

export const CommunitySentenceRowReportSchema = CaseRowSchema.pick({
  annotated_msg: true,
  defendant_name: true,
  error_id: true,
  msg_received_ts: true
}).extend({
  domestic_violence_flag: zod.boolean()
})

export type CommunitySentenceRowReport = z.infer<typeof CommunitySentenceRowReportSchema>
