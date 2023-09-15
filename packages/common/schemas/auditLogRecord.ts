import { z } from "zod"
import AuditLogStatus from "../types/AuditLogStatus"
import { auditLogEventSchema } from "./auditLogEvent"

export const auditLogApiRecordInputSchema = z.object({
  caseId: z.string(),
  createdBy: z.string(),
  externalId: z.string().optional(),
  externalCorrelationId: z.string(),
  isSanitised: z.number(),
  messageHash: z.string(),
  messageId: z.string(),
  nextSanitiseCheck: z.string().optional(),
  receivedDate: z.string(),
  s3Path: z.string().optional(),
  stepExecutionId: z.string().optional(),
  systemId: z.string().optional()
})

export const auditLogApiRecordOutputSchema = auditLogApiRecordInputSchema.extend({
  events: z.array(auditLogEventSchema),
  forceOwner: z.number().optional(),
  pncStatus: z.string(),
  status: z.nativeEnum(AuditLogStatus),
  triggerStatus: z.string()
})
