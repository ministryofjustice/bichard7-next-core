import { expect } from "expect"
import type { AuditLog, AuditLogEvent } from "../helpers/AuditLogApiHelper"
import { isError } from "./isError"
import Poller from "./Poller"
import type Bichard from "./world"

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
    timeout: 90000,
    delay: 1000,
    name: eventType,
    condition: (message: AuditLog | undefined) => {
      if (!message) {
        return false
      }

      events.push(...message.events)

      const hasEvent = message.events.some((event) => event.eventType === eventType)

      return !!contains === hasEvent
    }
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
    timeout: 90000,
    delay: 1000,
    name: "checkForRecord",
    condition: (message: AuditLog | undefined) => !!message
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
