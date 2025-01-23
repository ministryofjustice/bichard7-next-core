import z from "zod"

import { ApiAuditLogEventSchema, DynamoAuditLogEventSchema } from "./AuditLogEvent"
import AuditLogStatus from "./AuditLogStatus"

export const InputApiAuditLogSchema = z.object({
  caseId: z.string(),
  createdBy: z.string(),
  externalCorrelationId: z.string(),
  externalId: z.string().optional(),
  messageHash: z.string(),
  messageId: z.string(),
  receivedDate: z.string().datetime(),
  s3Path: z.string().optional(),
  systemId: z.string().optional()
})

export type InputApiAuditLog = z.infer<typeof InputApiAuditLogSchema>

export const OutputApiAuditLogSchema = InputApiAuditLogSchema.extend({
  events: z.array(ApiAuditLogEventSchema),
  forceOwner: z.number().optional(),
  pncStatus: z.string(),
  status: z.string(),
  triggerStatus: z.string()
})

export type OutputApiAuditLog = z.infer<typeof OutputApiAuditLogSchema>

export const InternalDynamoAuditLogSchema = OutputApiAuditLogSchema.omit({ events: true }).extend({
  errorRecordArchivalDate: z.string().optional(),
  eventsCount: z.number(),
  expiryTime: z.string().optional(),
  isSanitised: z.number(),
  nextSanitiseCheck: z.string(),
  retryCount: z.number().optional(),
  status: z.nativeEnum(AuditLogStatus),
  version: z.number()
})
export type InternalDynamoAuditLog = z.infer<typeof InternalDynamoAuditLogSchema>

export const DynamoAuditLogSchema = InternalDynamoAuditLogSchema.extend({
  events: z.array(DynamoAuditLogEventSchema).optional()
})

export type DynamoAuditLog = z.infer<typeof DynamoAuditLogSchema>
