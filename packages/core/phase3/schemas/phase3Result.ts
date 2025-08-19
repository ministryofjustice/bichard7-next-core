import { auditLogEventSchema } from "@moj-bichard7/common/schemas/auditLogEvent"
import pncUpdateDatasetSchema from "@moj-bichard7/common/schemas/pncUpdateDataset"
import { z } from "zod"

import { triggerSchema } from "../../schemas/trigger"
import { Phase3ResultType } from "../types/Phase3Result"

export const phase3ResultSchema = z.object({
  auditLogEvents: z.array(auditLogEventSchema),
  correlationId: z.string(),
  outputMessage: pncUpdateDatasetSchema,
  triggers: z.array(triggerSchema),
  triggerGenerationAttempted: z.boolean(),
  resultType: z.nativeEnum(Phase3ResultType)
})
