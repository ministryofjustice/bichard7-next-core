import { z } from "zod"

import { dateLikeToDate } from "../schemas/dateLikeToDate"

export const TriggerRowSchema = z.object({
  create_ts: dateLikeToDate,
  error_id: z.number().nullable(),
  resolved_by: z.string().nullable(),
  resolved_ts: dateLikeToDate.nullable(),
  status: z.number(),
  trigger_code: z.string(),
  trigger_id: z.number(),
  trigger_item_identity: z.string().nullable()
})

export const TriggerDtoSchema = z.object({
  createAt: dateLikeToDate,
  resolvedAt: dateLikeToDate.optional(),
  status: z.string(),
  triggerCode: z.string(),
  triggerId: z.number(),
  triggerItemIdentity: z.string().optional()
})

export type Trigger = z.infer<typeof TriggerRowSchema>
export type TriggerDto = z.infer<typeof TriggerDtoSchema>
