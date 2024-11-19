import { auditLogEventSchema } from "@moj-bichard7/common/schemas/auditLogEvent"
import { z } from "zod"

import pncUpdateDatasetSchema from "../../phase2/schemas/pncUpdateDataset"
import { triggerSchema } from "../../schemas/trigger"
import { Phase3ResultType } from "../types/Phase3Result"

export const phase3ResultSchema = z.object({
  auditLogEvents: z.array(auditLogEventSchema),
  correlationId: z.string(),
  outputMessage: pncUpdateDatasetSchema,
  pncOperations: z.any(),
  resultType: z.nativeEnum(Phase3ResultType),
  triggerGenerationAttempted: z.boolean(),
  triggers: z.array(triggerSchema)
})
