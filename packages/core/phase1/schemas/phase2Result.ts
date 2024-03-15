import { auditLogEventSchema } from "@moj-bichard7/common/schemas/auditLogEvent"
import { z } from "zod"

import { Phase2ResultType } from "../../phase2/types/Phase2Result"
import { annotatedPNCUpdateDatasetSchema } from "./annotatedPNCUpdateDataset"
import { triggerSchema } from "./trigger"

export const phase2ResultSchema = z.object({
  auditLogEvents: z.array(auditLogEventSchema),
  correlationId: z.string(),
  outputMessage: annotatedPNCUpdateDatasetSchema,
  triggers: z.array(triggerSchema),
  resultType: z.nativeEnum(Phase2ResultType)
})
