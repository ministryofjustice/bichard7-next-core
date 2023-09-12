import { z } from "zod"
import { Phase1ResultType } from "../types/Phase1Result"
import { annotatedHearingOutcomeSchema } from "./annotatedHearingOutcome"
import { auditLogEventSchema } from "./auditLogEvent"
import { triggerSchema } from "./trigger"

export const phase1ResultTypeSchema = z.nativeEnum(Phase1ResultType)

export const phase1ResultSchema = z.object({
  correlationId: z.string(),
  auditLogEvents: z.array(auditLogEventSchema),
  resultType: phase1ResultTypeSchema
})

export const phase1SuccessResultSchema = phase1ResultSchema.extend({
  hearingOutcome: annotatedHearingOutcomeSchema,
  triggers: z.array(triggerSchema)
})

export const phase1FailureResultSchema = phase1ResultSchema
