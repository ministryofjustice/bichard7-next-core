import { z } from "zod"
import { Phase1ResultType } from "../types/Phase1Result"
import { annotatedHearingOutcomeSchema } from "./annotatedHearingOutcome"
import { auditLogEventSchema } from "./auditLogEvent"
import { triggerSchema } from "./trigger"

export const phase1ResultSchema = z.object({
  correlationId: z.string(),
  auditLogEvents: z.array(auditLogEventSchema)
})

export const phase1SuccessResultSchema = phase1ResultSchema.extend({
  hearingOutcome: annotatedHearingOutcomeSchema,
  triggers: z.array(triggerSchema),
  resultType: z.union([
    z.literal(Phase1ResultType.success),
    z.literal(Phase1ResultType.exceptions),
    z.literal(Phase1ResultType.ignored)
  ])
})

export const phase1FailureResultSchema = phase1ResultSchema.extend({
  resultType: z.literal(Phase1ResultType.failure)
})
