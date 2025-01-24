/* eslint-disable @typescript-eslint/no-unused-vars */
import type { DynamoAuditLog, OutputApiAuditLog } from "../../types/AuditLog"
import type { ApiAuditLogEvent, DynamoAuditLogEvent } from "../../types/AuditLogEvent"

const convertDynamoAuditLogEventToApi = (event: DynamoAuditLogEvent): ApiAuditLogEvent => ({
  attributes: event.attributes,
  category: event.category,
  eventCode: event.eventCode,
  eventSource: event.eventSource,
  eventSourceQueueName: event.eventSourceQueueName,
  eventType: event.eventType,
  eventXml: event.eventXml,
  timestamp: event.timestamp,
  user: event.user
})

const convertDynamoAuditLogToOutputApi = (auditLog: DynamoAuditLog): OutputApiAuditLog => {
  const {
    errorRecordArchivalDate,
    events,
    eventsCount,
    expiryTime,
    isSanitised,
    nextSanitiseCheck,
    pncStatus,
    retryCount,
    triggerStatus,
    version,
    ...output
  } = auditLog

  return { ...output, ...(events ? { events: events.map(convertDynamoAuditLogEventToApi) } : {}) }
}

export default convertDynamoAuditLogToOutputApi
