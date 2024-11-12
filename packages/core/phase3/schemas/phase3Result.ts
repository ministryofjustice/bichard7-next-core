import { auditLogEventSchema } from "@moj-bichard7/common/schemas/auditLogEvent"
import { z } from "zod"

import { triggerSchema } from "../../schemas/trigger"
import pncUpdateDatasetSchema from "../../phase2/schemas/pncUpdateDataset"
import { Phase3ResultType } from "../types/Phase3Result"

export const phase3ResultSchema = z.object({
  auditLogEvents: z.array(auditLogEventSchema),
  correlationId: z.string(),
  outputMessage: pncUpdateDatasetSchema,
  pncOperations: z.any(),
  triggers: z.array(triggerSchema),
  triggerGenerationAttempted: z.boolean(),
  resultType: z.nativeEnum(Phase3ResultType)
})
