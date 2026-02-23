import { dateLikeToDate } from "@moj-bichard7/common/schemas/dateLikeToDate"
import { CaseRowSchema } from "@moj-bichard7/common/types/Case"
import { TriggerRowSchema } from "@moj-bichard7/common/types/Trigger"
import z from "zod"

export const CaseRowForWarrantsReportSchema = CaseRowSchema.pick({
  annotated_msg: true,
  asn: true,
  court_name: true,
  defendant_name: true,
  error_id: true,
  msg_received_ts: true,
  ptiurn: true
}).extend({
  court_date: dateLikeToDate,
  triggers: z.array(TriggerRowSchema)
})

export type CaseRowForWarrantsReport = z.infer<typeof CaseRowForWarrantsReportSchema>
