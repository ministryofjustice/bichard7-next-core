import type { FastifyBaseLogger } from "fastify"

import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import type AuditLogDynamoGateway from "../services/gateways/dynamo/AuditLogDynamoGateway/AuditLogDynamoGatewayInterface"
import type { ApiAuditLogEvent, DynamoAuditLogEvent } from "../types/AuditLogEvent"

import {
  isConditionalExpressionViolationError,
  isTooManyEventsError,
  isTransactionConflictError
} from "../services/gateways/dynamo"
import ConflictError from "../types/errors/ConflictError"
import { NotFoundError } from "../types/errors/NotFoundError"
import EventCode from "../types/EventCode"
import calculateAuditLogEventIndices from "./createAuditLogEvents/calculateAuditLogEventIndices"
import calculateErrorRecordArchivalDate from "./createAuditLogEvents/calculateErrorRecordArchivalDate"
import calculateForceOwner from "./createAuditLogEvents/calculateForceOwner"
import calculateRetryCount from "./createAuditLogEvents/calculateRetryCount"
import calculateSanitisation from "./createAuditLogEvents/calculateSanitisation"
import calculateStatuses from "./createAuditLogEvents/calculateStatuses"

const eventCodeLookup: { [k: string]: EventCode } = {
  "Error record archival": EventCode.ErrorRecordArchived,
  "Hearing outcome ignored - Appeal result did not amend disposal": EventCode.IgnoredAppeal,
  "Hearing outcome ignored - PNC update is not enabled for this court": EventCode.IgnoredDisabled,
  "Hearing Outcome ignored as it contains no offences": EventCode.IgnoredNoOffences,
  "Hearing Outcome ignored as no offences are recordable": EventCode.IgnoredNonrecordable,
  "Hearing Outcome marked as resolved by user": EventCode.ExceptionsResolved,
  "Hearing Outcome passed to Error List": EventCode.ExceptionsGenerated,
  "Input message received": EventCode.HearingOutcomeDetails,
  "Interim hearing with ancillary only court results. PNC not updated": EventCode.IgnoredAncillary,
  "Message Rejected by [AmendedHearingOutcomeBean] MDB": EventCode.MessageRejected,
  "Message Rejected by [CourtResultBean] MDB": EventCode.MessageRejected,
  "Message Rejected by [PNCUpdateChoreographyDSBean] MDB": EventCode.MessageRejected,
  "Message Rejected by [PNCUpdateChoreographyHOBean] MDB": EventCode.MessageRejected,
  "Message Rejected by [PNCUpdateProcessorBean] MDB": EventCode.MessageRejected,
  "PNC Response not received": EventCode.PncResponseNotReceived,
  "PNC Response received": EventCode.PncResponseReceived,
  "PNC Update added to Error List (PNC message construction)": EventCode.ExceptionsGenerated,
  "PNC Update added to Error List (Unexpected PNC response)": EventCode.ExceptionsGenerated,
  "PNC Update applied successfully": EventCode.PncUpdated,
  "Re-opened / Statutory Declaration case ignored": EventCode.IgnoredReopened,
  "Retrying failed message": EventCode.RetryingMessage,
  "Sanitised message": EventCode.Sanitised,
  "Trigger generated": EventCode.TriggersGenerated,
  "Trigger Instances resolved": EventCode.TriggersResolved
}

const transformAuditLogEvent = (event: ApiAuditLogEvent): ApiAuditLogEvent => {
  if (event.attributes?.eventCode && typeof event.attributes.eventCode === "string") {
    event.eventCode = event.attributes.eventCode
    delete event.attributes.eventCode
  }

  if (!event.eventCode) {
    event.eventCode = eventCodeLookup[event.eventType]
  }

  const user = event.attributes?.user ?? event.attributes?.User
  if (typeof user === "string") {
    event.user = user
    delete event.attributes?.user
    delete event.attributes?.User
  }

  return event
}

const shouldDeduplicate = (event: ApiAuditLogEvent): boolean =>
  event.category === "error" &&
  !!event.attributes?.["Exception Message"] &&
  !!event.attributes?.["Exception Stack Trace"]

const stackTraceFirstLine = (stackTrace: string): string => stackTrace.split("\n")[0].trim()

const isDuplicateEvent = (event: ApiAuditLogEvent, existingEvents: ApiAuditLogEvent[]): boolean => {
  if (existingEvents.length === 0) {
    return false
  }

  const lastEvent = existingEvents[existingEvents.length - 1]
  if (lastEvent && lastEvent.attributes?.["Exception Message"] === event.attributes?.["Exception Message"]) {
    if (
      typeof lastEvent.attributes?.["Exception Stack Trace"] === "string" &&
      typeof event.attributes?.["Exception Stack Trace"] === "string"
    ) {
      const previousStacktrace: string = lastEvent.attributes["Exception Stack Trace"] as string
      const thisStacktrace: string = event.attributes["Exception Stack Trace"] as string

      if (stackTraceFirstLine(previousStacktrace) === stackTraceFirstLine(thisStacktrace)) {
        return true
      }
    }
  }

  return false
}

const filterDuplicateEvents = (existingEvents: ApiAuditLogEvent[]) => {
  const deduplicatedNewEvents: ApiAuditLogEvent[] = []
  return (event: ApiAuditLogEvent): boolean => {
    if (!shouldDeduplicate(event)) {
      deduplicatedNewEvents.push(event)
      return true
    }

    const result = !isDuplicateEvent(event, [...existingEvents, ...deduplicatedNewEvents])
    if (result) {
      deduplicatedNewEvents.push(event)
    }

    return result
  }
}

const convertApiEventToDynamo = (event: ApiAuditLogEvent, messageId: string): DynamoAuditLogEvent => ({
  ...event,
  ...calculateAuditLogEventIndices(event),
  _messageId: messageId
})

const retryAttempts = 10

const createAuditLogEvents = async (
  auditLogEvents: ApiAuditLogEvent[],
  correlationId: string,
  auditLogGateway: AuditLogDynamoGateway,
  logger?: FastifyBaseLogger,
  attempts = retryAttempts
): PromiseResult<void> => {
  const auditLog = await auditLogGateway.fetchOne(correlationId, {
    includeColumns: ["version", "eventsCount"],
    stronglyConsistentRead: true
  })

  if (isError(auditLog)) {
    return auditLog
  }

  if (!auditLog) {
    return new NotFoundError(`A message with Id ${correlationId} does not exist in the database`)
  }

  const transformedAuditLogEvents = auditLogEvents.map(transformAuditLogEvent)
  const newDynamoEvents = transformedAuditLogEvents.map((event) => convertApiEventToDynamo(event, correlationId))

  const allEvents = newDynamoEvents.concat(auditLog.events ?? [])
  const deduplicatedNewEvents = newDynamoEvents.filter(filterDuplicateEvents(auditLog.events ?? []))

  if (deduplicatedNewEvents.length === 0) {
    return
  }

  const updates = {
    ...calculateForceOwner(allEvents),
    ...calculateStatuses(auditLog, allEvents),
    ...calculateErrorRecordArchivalDate(allEvents),
    ...calculateSanitisation(allEvents),
    ...calculateRetryCount(allEvents),
    events: deduplicatedNewEvents
  }

  const transactionResult = await auditLogGateway.update(auditLog, updates, deduplicatedNewEvents)

  if (isError(transactionResult)) {
    if (isConditionalExpressionViolationError(transactionResult) || isTransactionConflictError(transactionResult)) {
      if (attempts > 1) {
        logger?.info("Retrying ", attempts)
        // Wait 250 - 750ms and try again
        const delay = Math.floor(250 + Math.random() * 500)
        await new Promise((resolve) => setTimeout(resolve, delay))
        return createAuditLogEvents(auditLogEvents, correlationId, auditLogGateway, logger, attempts - 1)
      }

      return new ConflictError(
        `Conflict writing event to message with Id ${correlationId}. Tried ${retryAttempts} times`
      )
    } else if (transactionResult instanceof NotFoundError) {
      return new NotFoundError(`A message with Id ${correlationId} does not exist in the database`)
    }

    if (isTooManyEventsError(transactionResult)) {
      return new Error(`Too many actions for a dynamodb transaction: ${transactionResult.message}`)
    }

    return new Error(transactionResult.message)
  }
}

export default createAuditLogEvents
