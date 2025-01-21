import type { AxiosError } from "axios"

import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"
import axios from "axios"

import type { InputApiAuditLog, OutputApiAuditLog } from "../../types/AuditLog"
import type { ApiAuditLogEvent } from "../../types/AuditLogEvent"

import AuditLogStatus from "../../types/AuditLogStatus"
import PncStatus from "../../types/PncStatus"
import TriggerStatus from "../../types/TriggerStatus"
import { mockApiAuditLogEvent, mockInputApiAuditLog } from "./mockAuditLogs"

export const createMockError = async (overrides: Partial<InputApiAuditLog> = {}): PromiseResult<OutputApiAuditLog> => {
  const auditLog = mockInputApiAuditLog(overrides)
  await axios.post("http://localhost:3010/messages", auditLog)

  const event = mockApiAuditLogEvent({ category: "error", eventType: "Hearing Outcome Input Queue Failure" })
  const res = await axios.post(`http://localhost:3010/messages/${auditLog.messageId}/events`, event)
  if (isError(res)) {
    return res
  }

  return {
    ...auditLog,
    events: [event],
    pncStatus: PncStatus.Processing,
    status: AuditLogStatus.error,
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

export const createMockAuditLog = async (
  overrides: Partial<InputApiAuditLog> = {}
): PromiseResult<OutputApiAuditLog> => {
  const auditLog = mockInputApiAuditLog(overrides)
  const res = await axios.post("http://localhost:3010/messages", auditLog).catch((error: AxiosError) => error)
  if (isError(res)) {
    return res
  }

  return {
    ...auditLog,
    events: [],
    pncStatus: PncStatus.Processing,
    status: AuditLogStatus.processing,
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

  const res = await axios
    .post(`http://localhost:3010/messages/${messageId}/events`, auditLogEvent)
    .catch((error: AxiosError) => error)

  if (isError(res)) {
    return res
  }

  return auditLogEvent
}

export const createMockRetriedError = async (): PromiseResult<OutputApiAuditLog> => {
  const events: ApiAuditLogEvent[] = []
  const auditLog = mockInputApiAuditLog()
  await axios.post("http://localhost:3010/messages", auditLog)

  const event = mockApiAuditLogEvent({ category: "error", eventType: "Hearing Outcome Input Queue Failure" })
  const res = await axios.post(`http://localhost:3010/messages/${auditLog.messageId}/events`, event)
  if (isError(res)) {
    return res
  }

  events.push(event)

  for (let i = 0; i < 3; i++) {
    const retryEvent = mockApiAuditLogEvent({ category: "information", eventType: "Retrying failed message" })
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
    status: AuditLogStatus.processing,
    triggerStatus: TriggerStatus.NoTriggers
  }
}
