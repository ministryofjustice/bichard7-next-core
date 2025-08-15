import { auditLogEventSchema } from "@moj-bichard7/common/schemas/auditLogEvent"
import { z } from "zod"

import { unvalidatedHearingOutcomeSchema } from "@moj-bichard7/common/schemas/unvalidatedHearingOutcome"
import { triggerSchema } from "../../schemas/trigger"
import { Phase1ResultType } from "../types/Phase1Result"

export const phase1ResultSchema = z.object({
  auditLogEvents: z.array(auditLogEventSchema),
  correlationId: z.string(),
  hearingOutcome: unvalidatedHearingOutcomeSchema,
  triggers: z.array(triggerSchema),
  resultType: z.nativeEnum(Phase1ResultType)
})
