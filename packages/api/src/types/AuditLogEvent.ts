import type EventCategory from "./EventCategory"

export type ApiAuditLogEvent = {
  attributes?: AuditLogEventAttributes
  category: EventCategory
  eventCode: string
  eventSource: string
  eventSourceQueueName?: string
  eventType: string
  eventXml?: AuditLogEventCompressedValue | string
  timestamp: string
  user?: string
}

export type AuditLogEventAttributes = {
  [key: string]: AuditLogEventAttributeValue
}

export type AuditLogEventAttributeValue = AuditLogEventCompressedValue | AuditLogEventDecompressedAttributeValue

export type AuditLogEventCompressedValue = { _compressedValue: string }

export type AuditLogEventDecompressedAttributes = {
  [key: string]: AuditLogEventDecompressedAttributeValue
}

export type AuditLogEventDecompressedAttributeValue = boolean | number | string

export type DynamoAuditLogEvent = ApiAuditLogEvent & {
  _automationReport: number
  _messageId: string
  _topExceptionsReport: number
}

export type DynamoAuditLogUserEvent = ApiAuditLogEvent & {
  _automationReport: number
  _topExceptionsReport: number
}
