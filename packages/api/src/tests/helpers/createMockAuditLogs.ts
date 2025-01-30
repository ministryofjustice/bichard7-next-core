import AuditLogStatus from "@moj-bichard7/common/types/AuditLogStatus"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"
import axios from "axios"

import type { DynamoAuditLog, InputApiAuditLog, OutputApiAuditLog } from "../../types/AuditLog"
import type { ApiAuditLogEvent } from "../../types/AuditLogEvent"

import { AuditLogDynamoGateway } from "../../services/gateways/dynamo"
import PncStatus from "../../types/PncStatus"
import TriggerStatus from "../../types/TriggerStatus"
import createAuditLogEvents from "../../useCases/createAuditLogEvents"
import auditLogDynamoConfig from "./dynamoDbConfig"
import {
  mockApiAuditLogEvent,
  mockDynamoAuditLog,
  mockDynamoAuditLogEvent,
  mockInputApiAuditLog
} from "./mockAuditLogs"

const dynamoGateway = new AuditLogDynamoGateway(auditLogDynamoConfig)

export const createMockError = async (overrides: Partial<DynamoAuditLog> = {}): PromiseResult<DynamoAuditLog> => {
  const auditLog = mockDynamoAuditLog(overrides)
  const res1 = await dynamoGateway.create(auditLog)
  if (isError(res1)) {
    return res1
  }

  const event = mockDynamoAuditLogEvent({
    category: EventCategory.error,
    eventType: "Hearing Outcome Input Queue Failure"
  })
  const res = await createAuditLogEvents([event], auditLog.messageId, dynamoGateway)
  if (isError(res)) {
    return res
  }

  return {
    ...auditLog,
    events: [event],
    pncStatus: PncStatus.Processing,
    status: AuditLogStatus.Error,
    triggerStatus: TriggerStatus.NoTriggers
  }
}

export const createMockErrors = async (
  count = 1,
  overrides: Partial<InputApiAuditLog> = {}
): PromiseResult<OutputApiAuditLog[]> => {
  const output = []
  for (let i = 0; i < count; i++) {
    const res = await createMockError(overrides)
    if (isError(res)) {
      return res
    }

    output.push(res)
  }

  return output
}

export const createMockAuditLog = async (overrides: Partial<DynamoAuditLog> = {}): PromiseResult<DynamoAuditLog> => {
  const auditLog = mockDynamoAuditLog(overrides)
  const res = await dynamoGateway.create(auditLog)

  if (isError(res)) {
    return res
  }

  return {
    ...auditLog,
    events: [],
    pncStatus: PncStatus.Processing,
    status: AuditLogStatus.Processing,
    triggerStatus: TriggerStatus.NoTriggers
  }
}

export const createMockAuditLogs = async (
  count = 1,
  overrides: Partial<InputApiAuditLog> = {}
): PromiseResult<OutputApiAuditLog[]> => {
  const output = []
  for (let i = 0; i < count; i++) {
    const res = await createMockAuditLog(overrides)
    if (isError(res)) {
      return res
    }

    output.push(res)
  }

  return output
}

export const createMockAuditLogEvent = async (
  messageId: string,
  overrides: Partial<ApiAuditLogEvent> = {}
): PromiseResult<ApiAuditLogEvent> => {
  const auditLogEvent = mockApiAuditLogEvent(overrides)
  const res = await createAuditLogEvents([auditLogEvent], messageId, dynamoGateway)

  if (isError(res)) {
    return res
  }

  return auditLogEvent
}

export const createMockRetriedError = async (): PromiseResult<OutputApiAuditLog> => {
  const events: ApiAuditLogEvent[] = []
  const auditLog = mockInputApiAuditLog()
  await axios.post("http://localhost:3010/messages", auditLog)

  const event = mockApiAuditLogEvent({
    category: EventCategory.error,
    eventType: "Hearing Outcome Input Queue Failure"
  })
  const res = await axios.post(`http://localhost:3010/messages/${auditLog.messageId}/events`, event)
  if (isError(res)) {
    return res
  }

  events.push(event)

  for (let i = 0; i < 3; i++) {
    const retryEvent = mockApiAuditLogEvent({
      category: EventCategory.information,
      eventType: "Retrying failed message"
    })
    const retryRes = await axios.post(`http://localhost:3010/messages/${auditLog.messageId}/events`, retryEvent)
    if (isError(retryRes)) {
      return retryRes
    }

    events.push(retryEvent)
  }

  return {
    ...auditLog,
    events,
    pncStatus: PncStatus.Processing,
    status: AuditLogStatus.Processing,
    triggerStatus: TriggerStatus.NoTriggers
  }
}
