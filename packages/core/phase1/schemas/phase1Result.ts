import { z } from "zod"
import { Phase1ResultType } from "../types/Phase1Result"
import { annotatedHearingOutcomeSchema } from "./annotatedHearingOutcome"
import { auditLogEventSchema } from "./auditLogEvent"
import { triggerSchema } from "./trigger"

export const phase1ResultTypeSchema = z.nativeEnum(Phase1ResultType)

export const phase1ResultBaseSchema = z.object({
  auditLogEvents: z.array(auditLogEventSchema),
  resultType: phase1ResultTypeSchema
})

export const phase1SuccessResultSchema = phase1ResultBaseSchema.extend({
  correlationId: z.string(),
  hearingOutcome: annotatedHearingOutcomeSchema,
  triggers: z.array(triggerSchema),
  resultType: z.union([
    z.literal(Phase1ResultType.success),
    z.literal(Phase1ResultType.exceptions),
    z.literal(Phase1ResultType.ignored)
  ])
})

export const phase1FailureResultSchema = phase1ResultBaseSchema.extend({
  correlationId: z.string().optional(),
  resultType: z.literal(Phase1ResultType.failure)
})

export const phase1ResultSchema = z.discriminatedUnion("resultType", [
  phase1SuccessResultSchema,
  phase1FailureResultSchema
])
