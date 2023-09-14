import { auditLogEventSchema } from "@moj-bichard7/common/schemas/auditLogEvent"
import { z } from "zod"
import { Phase1ResultType } from "../types/Phase1Result"
import { annotatedHearingOutcomeSchema, invalidAnnotatedHearingOutcomeSchema } from "./annotatedHearingOutcome"

import { triggerSchema } from "./trigger"

export const phase1ResultTypeSchema = z.nativeEnum(Phase1ResultType)

export const phase1ResultBaseSchema = z.object({
  auditLogEvents: z.array(auditLogEventSchema)
})

export const phase1SuccessResultSchema = phase1ResultBaseSchema.extend({
  correlationId: z.string(),
  hearingOutcome: annotatedHearingOutcomeSchema,
  triggers: z.array(triggerSchema),
  resultType: z.literal(Phase1ResultType.success)
})

export const phase1IgnoredResultSchema = phase1SuccessResultSchema.extend({
  resultType: z.literal(Phase1ResultType.ignored)
})

export const phase1ExceptionsResultSchema = phase1SuccessResultSchema.extend({
  hearingOutcome: invalidAnnotatedHearingOutcomeSchema,
  resultType: z.literal(Phase1ResultType.exceptions)
})

export const phase1FailureResultSchema = phase1ResultBaseSchema.extend({
  correlationId: z.string().optional(),
  failureMessage: z.string(),
  resultType: z.literal(Phase1ResultType.failure)
})

export const persistablePhase1ResultSchema = z.union([phase1SuccessResultSchema, phase1ExceptionsResultSchema])

export const validPhase1ResultSchema = z.union([
  phase1ExceptionsResultSchema,
  phase1IgnoredResultSchema,
  phase1SuccessResultSchema
])

export const phase1ResultSchema = z.union([
  phase1ExceptionsResultSchema,
  phase1FailureResultSchema,
  phase1IgnoredResultSchema,
  phase1SuccessResultSchema
])
