import EventCategory from "@moj-bichard7/common/types/EventCategory"
import z from "zod"

export const AuditLogEventCompressedValueSchema = z.object({ _compressedValue: z.string() })

export type AuditLogEventCompressedValue = z.infer<typeof AuditLogEventCompressedValueSchema>

export const AuditLogEventDecompressedAttributeValueSchema = z.union([z.boolean(), z.number(), z.string()])

export type AuditLogEventDecompressedAttributeValue = z.infer<typeof AuditLogEventDecompressedAttributeValueSchema>

export const AuditLogEventAttributeValueSchema = z.union([
  AuditLogEventCompressedValueSchema,
  AuditLogEventDecompressedAttributeValueSchema
])

export type AuditLogEventAttributeValue = z.infer<typeof AuditLogEventAttributeValueSchema>

export const AuditLogEventAttributesSchema = z.record(AuditLogEventAttributeValueSchema)

export type AuditLogEventAttributes = z.infer<typeof AuditLogEventAttributesSchema>

export const ApiAuditLogEventSchema = z.object({
  attributes: AuditLogEventAttributesSchema.optional(),
  category: z.nativeEnum(EventCategory),
  eventCode: z.string(),
  eventSource: z.string(),
  eventSourceQueueName: z.string().optional(),
  eventType: z.string(),
  eventXml: AuditLogEventCompressedValueSchema.or(z.string()).optional(),
  timestamp: z.string(),
  user: z.string().optional()
})

export type ApiAuditLogEvent = z.infer<typeof ApiAuditLogEventSchema>

export const DynamoAuditLogEventSchema = ApiAuditLogEventSchema.extend({
  _automationReport: z.number(),
  _messageId: z.string(),
  _topExceptionsReport: z.number()
})

export type DynamoAuditLogEvent = z.infer<typeof DynamoAuditLogEventSchema>

export const DynamoAuditLogUserEventSchema = ApiAuditLogEventSchema.extend({
  _automationReport: z.number(),
  _topExceptionsReport: z.number()
})

export type DynamoAuditLogUserEvent = z.infer<typeof DynamoAuditLogUserEventSchema>
