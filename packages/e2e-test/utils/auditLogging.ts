import { expect } from "expect"

import type { AuditLog, AuditLogEvent } from "../helpers/AuditLogApiHelper"
import type Bichard from "./world"

import { isError } from "./isError"
import Poller from "./Poller"

export const checkEventByExternalCorrelationId = async (
  context: Bichard,
  externalCorrelationId: string,
  eventType: string,
  contains: boolean
) => {
  const { auditLogApi } = context
  const getMessages = () => auditLogApi.getMessageByExternalCorrelationId(externalCorrelationId)

  const events: AuditLogEvent[] = []
  const options = {
    condition: (message: AuditLog | undefined) => {
      if (!message) {
        return false
      }

      events.push(...message.events)

      const hasEvent = message.events.some((event) => event.eventType === eventType)

      return !!contains === hasEvent
    },
    delay: 1000,
    name: eventType,
    timeout: 90000
  }

  const result = await new Poller(getMessages)
    .poll(options)
    .then((messages) => messages)
    .catch((error) => error)

  if (!isError(result)) {
    return
  }

  let eventsFoundMessage = ""

  if (events.length === 0) {
    eventsFoundMessage = `Message with correlation ID ${externalCorrelationId} not found.`
  } else {
    eventsFoundMessage = `
    Following events found in the message with correlation ID ${externalCorrelationId}:
    ${events
      .sort((eventA: AuditLogEvent, eventB: AuditLogEvent) => (eventA.timestamp > eventB.timestamp ? 1 : -1))
      .map((event) => `\t- ${event.timestamp}: ${event.eventType}\n`)}
    `
  }

  throw new Error(`${result.message}${eventsFoundMessage}`)
}

export const checkAuditLogRecordExists = async (context: Bichard, correlationId: string) => {
  const { auditLogApi } = context
  const getMessages = (): Promise<AuditLog | undefined> => auditLogApi.getMessageByExternalCorrelationId(correlationId)

  const options = {
    condition: (message: AuditLog | undefined) => !!message,
    delay: 1000,
    name: "checkForRecord",
    timeout: 90000
  }

  const result = await new Poller<AuditLog | undefined>(getMessages)
    .poll(options)
    .then((messages) => messages)
    .catch((error) => error)

  if (!isError(result)) {
    return
  }

  throw new Error(`Could not find audit log with external correlation ID: ${correlationId}`)
}

export const checkAuditLogExists = async (context: Bichard, eventType: string, contains: boolean) => {
  if (!context.currentCorrelationId) {
    throw new Error("Current correlation ID is false")
  }

  const checkEventResult = await checkEventByExternalCorrelationId(
    context,
    context.currentCorrelationId,
    eventType,
    contains
  )
  expect(isError(checkEventResult)).toBeFalsy()
}
