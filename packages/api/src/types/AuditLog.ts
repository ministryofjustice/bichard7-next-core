import AuditLogStatus from "@moj-bichard7/common/types/AuditLogStatus"
import z from "zod"

import { ApiAuditLogEventSchema, DynamoAuditLogEventSchema } from "./AuditLogEvent"
import PncStatus from "./PncStatus"
import TriggerStatus from "./TriggerStatus"

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

// The fields here are optional because we can exclude them using query parameters
export const OutputApiAuditLogSchema = z.object({
  caseId: z.string().optional(),
  createdBy: z.string().optional(),
  events: z.array(ApiAuditLogEventSchema).optional(),
  externalCorrelationId: z.string().optional(),
  externalId: z.string().optional(),
  forceOwner: z.number().optional(),
  messageHash: z.string().optional(),
  messageId: z.string().optional(),
  pncStatus: z.string().optional(),
  receivedDate: z.string().datetime().optional(),
  s3Path: z.string().optional(),
  status: z.string().optional(),
  systemId: z.string().optional(),
  triggerStatus: z.string().optional()
})

export type OutputApiAuditLog = z.infer<typeof OutputApiAuditLogSchema>

export const InternalDynamoAuditLogSchema = InputApiAuditLogSchema.extend({
  errorRecordArchivalDate: z.string().optional(),
  eventsCount: z.number(),
  expiryTime: z.string().optional(),
  forceOwner: z.number().optional(),
  isSanitised: z.number(),
  nextSanitiseCheck: z.string(),
  pncStatus: z.nativeEnum(PncStatus),
  retryCount: z.number().optional(),
  status: z.nativeEnum(AuditLogStatus),
  triggerStatus: z.nativeEnum(TriggerStatus),
  version: z.number()
})
export type InternalDynamoAuditLog = z.infer<typeof InternalDynamoAuditLogSchema>

export const DynamoAuditLogSchema = InternalDynamoAuditLogSchema.extend({
  events: z.array(DynamoAuditLogEventSchema).optional()
})

export type DynamoAuditLog = z.infer<typeof DynamoAuditLogSchema>
