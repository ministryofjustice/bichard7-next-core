import { z } from "zod"

export const CaseSchema = z.object({
  error_id: z.number(),
  message_id: z.string(),
  phase: z.number().gt(0).lte(3),
  trigger_count: z.number(),
  is_urgent: z.number(),
  annotated_msg: z.string(),
  error_report: z.string().max(1000),
  create_ts: z.string().datetime(),
  error_count: z.number(),
  user_updated_flag: z.number(),
  msg_received_ts: z.string().datetime(),
  court_reference: z.string().max(11),
  total_pnc_failure_resubmissions: z.number().default(0),
  org_for_police_filter: z.string()
})

export type Case = z.infer<typeof CaseSchema>
