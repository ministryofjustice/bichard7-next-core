import { auditLogEventSchema } from "@moj-bichard7/common/schemas/auditLogEvent"
import { z } from "zod"

import { Phase2ResultType } from "../types/Phase2Result"
import { triggerSchema } from "../../phase1/schemas/trigger"
import pncUpdateDatasetSchema from "./pncUpdateDataset"

export const phase2ResultSchema = z.object({
  auditLogEvents: z.array(auditLogEventSchema),
  correlationId: z.string(),
  outputMessage: pncUpdateDatasetSchema,
  triggers: z.array(triggerSchema),
  resultType: z.nativeEnum(Phase2ResultType)
})
