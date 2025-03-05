import EventCategory from "@moj-bichard7/common/types/EventCategory"
import z from "zod"

// The compressed data structure for an attribute
export const AuditLogEventCompressedValueSchema = z.object({ _compressedValue: z.string() })

export type AuditLogEventCompressedValue = z.infer<typeof AuditLogEventCompressedValueSchema>

// The uncompressed data structure for an attribute
export const AuditLogEventAttributeValueSchema = z.union([
  z.boolean(),
  z.number(),
  z.string(),
  z.object({}).passthrough()
])

export type AuditLogEventDecompressedAttributeValue = z.infer<typeof AuditLogEventAttributeValueSchema>

// The internal dynamo representation of an attribute, either compressed or uncompressed
export const InternalAuditLogEventAttributeValueSchema = z.union([
  AuditLogEventCompressedValueSchema,
  AuditLogEventAttributeValueSchema
])

export type InternalAuditLogEventAttributeValue = z.infer<typeof InternalAuditLogEventAttributeValueSchema>

// The record of uncompressed attributes
export const AuditLogEventAttributesSchema = z.record(AuditLogEventAttributeValueSchema)

export type AuditLogEventAttributes = z.infer<typeof AuditLogEventAttributesSchema>

// The record of compressed or uncompressed attributes used in Dynamo
export const InternalAuditLogEventAttributesSchema = z.record(InternalAuditLogEventAttributeValueSchema)

export type InternalAuditLogEventAttributes = z.infer<typeof InternalAuditLogEventAttributesSchema>

export const ApiAuditLogEventSchema = z.object({
  attributes: AuditLogEventAttributesSchema.optional(),
  category: z.nativeEnum(EventCategory),
  eventCode: z.string(),
  eventSource: z.string(),
  eventSourceQueueName: z.string().optional(),
  eventType: z.string(),
  eventXml: z.string().optional(),
  timestamp: z.string().datetime(),
  user: z.string().optional()
})

export type ApiAuditLogEvent = z.infer<typeof ApiAuditLogEventSchema>

// The internal schema is the actual representation in Dynamo, including compression
export const InternalDynamoAuditLogEventSchema = ApiAuditLogEventSchema.extend({
  _automationReport: z.number(),
  _id: z.string(),
  _messageId: z.string(),
  _topExceptionsReport: z.number(),
  attributes: InternalAuditLogEventAttributesSchema.optional(),
  eventXml: InternalAuditLogEventAttributeValueSchema.optional()
})

export type InternalDynamoAuditLogEvent = z.infer<typeof InternalDynamoAuditLogEventSchema>

// The regular schema is the schema exposed by the Dynamo gateway
export const DynamoAuditLogEventSchema = InternalDynamoAuditLogEventSchema.omit({
  _id: true,
  attributes: true
}).extend({
  attributes: AuditLogEventAttributesSchema.optional(),
  eventXml: z.string().optional()
})

export type DynamoAuditLogEvent = z.infer<typeof DynamoAuditLogEventSchema>

export const InternalDynamoAuditLogUserEventSchema = ApiAuditLogEventSchema.extend({
  _automationReport: z.number(),
  _id: z.string(),
  _topExceptionsReport: z.number(),
  attributes: InternalAuditLogEventAttributesSchema.optional()
})

export type InternalDynamoAuditLogUserEvent = z.infer<typeof InternalDynamoAuditLogUserEventSchema>

export const DynamoAuditLogUserEventSchema = InternalDynamoAuditLogUserEventSchema.omit({
  _id: true,
  attributes: true
}).extend({
  attributes: AuditLogEventAttributesSchema.optional()
})

export type DynamoAuditLogUserEvent = z.infer<typeof DynamoAuditLogUserEventSchema>
