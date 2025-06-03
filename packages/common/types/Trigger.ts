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

export const TriggerSchema = z.object({
  createAt: dateLikeToDate,
  errorId: z.number().nullable(),
  resolvedAt: dateLikeToDate.nullable(),
  resolvedBy: z.string().nullable(),
  status: z.number(),
  triggerCode: z.string(),
  triggerId: z.number(),
  triggerItemIdentity: z.string().nullable()
})

export const TriggerDtoSchema = z.object({
  createAt: dateLikeToDate,
  description: z.string(),
  resolvedAt: dateLikeToDate.optional(),
  shortTriggerCode: z.string().nullable(),
  status: z.string(),
  triggerCode: z.string(),
  triggerId: z.number(),
  triggerItemIdentity: z.number().optional()
})

export type Trigger = z.infer<typeof TriggerSchema>
export type TriggerDto = z.infer<typeof TriggerDtoSchema>
export type TriggerRow = z.infer<typeof TriggerRowSchema>
