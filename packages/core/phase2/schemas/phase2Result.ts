import { auditLogEventSchema } from "@moj-bichard7/common/schemas/auditLogEvent"
import { z } from "zod"

import pncUpdateDatasetSchema from "../../schemas/pncUpdateDataset"
import { triggerSchema } from "../../schemas/trigger"
import { Phase2ResultType } from "../types/Phase2Result"

export const phase2ResultSchema = z.object({
  auditLogEvents: z.array(auditLogEventSchema),
  correlationId: z.string(),
  outputMessage: pncUpdateDatasetSchema,
  triggers: z.array(triggerSchema),
  triggerGenerationAttempted: z.boolean(),
  resultType: z.nativeEnum(Phase2ResultType)
})
