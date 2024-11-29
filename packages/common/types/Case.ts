import { z } from "zod"

export const CaseSchema = z.object({
  annotated_msg: z.string(),
  court_reference: z.string().max(11),
  create_ts: z.string().datetime(),
  error_count: z.number(),
  error_id: z.number(),
  error_locked_by_id: z.string().nullable(),
  error_report: z.string().max(1000),
  error_status: z.number().nullable(),
  is_urgent: z.number(),
  message_id: z.string(),
  msg_received_ts: z.string().datetime(),
  org_for_police_filter: z.string(),
  phase: z.number().gt(0).lte(3),
  resolution_ts: z.string().datetime().nullable(),
  total_pnc_failure_resubmissions: z.number().default(0),
  trigger_count: z.number(),
  user_updated_flag: z.number()
})

export type Case = z.infer<typeof CaseSchema>
