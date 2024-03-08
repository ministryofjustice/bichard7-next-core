import { auditLogEventSchema } from "@moj-bichard7/common/schemas/auditLogEvent"
import { z } from "zod"
import { Phase1ResultType } from "../types/Phase1Result"
import { triggerSchema } from "./trigger"
import { unvalidatedHearingOutcomeSchema } from "./unvalidatedHearingOutcome"
import { validatedHearingOutcomeSchema } from "./validatedHearingOutcome"

export const phase1ResultTypeSchema = z.nativeEnum(Phase1ResultType)

export const phase1ResultBaseSchema = z.object({
  auditLogEvents: z.array(auditLogEventSchema)
})

export const phase1SuccessResultSchema = phase1ResultBaseSchema.extend({
  correlationId: z.string(),
  hearingOutcome: validatedHearingOutcomeSchema,
  triggers: z.array(triggerSchema),
  resultType: z.literal(Phase1ResultType.success)
})

export const phase1IgnoredResultSchema = phase1SuccessResultSchema.extend({
  resultType: z.literal(Phase1ResultType.ignored)
})

export const phase1ExceptionsResultSchema = phase1SuccessResultSchema.extend({
  hearingOutcome: unvalidatedHearingOutcomeSchema,
  resultType: z.literal(Phase1ResultType.exceptions)
})

export const persistablePhase1ResultSchema = z.union([phase1SuccessResultSchema, phase1ExceptionsResultSchema])

export const validPhase1ResultSchema = z.union([
  phase1ExceptionsResultSchema,
  phase1IgnoredResultSchema,
  phase1SuccessResultSchema
])

export const phase1ResultSchema = z.union([
  phase1ExceptionsResultSchema,
  phase1IgnoredResultSchema,
  phase1SuccessResultSchema
])
