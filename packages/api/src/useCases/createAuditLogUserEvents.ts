import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { FastifyBaseLogger } from "fastify"

import { isError } from "@moj-bichard7/common/types/Result"
import { randomInt } from "node:crypto"

import type { AuditLogDynamoGateway } from "../services/gateways/dynamo/"
import type { ApiAuditLogEvent, DynamoAuditLogUserEvent } from "../types/AuditLogEvent"

import {
  isConditionalExpressionViolationError,
  isTooManyEventsError,
  isTransactionConflictError
} from "../services/gateways/dynamo/"
import ConflictError from "../types/errors/ConflictError"
import calculateAuditLogEventIndices from "./createAuditLogEvents/calculateAuditLogEventIndices"

const convertApiUserEventToDynamo = (event: ApiAuditLogEvent): DynamoAuditLogUserEvent => ({
  ...event,
  ...calculateAuditLogEventIndices(event)
})

const createAuditLogUserEvents = async (
  events: ApiAuditLogEvent[],
  auditLogGateway: AuditLogDynamoGateway,
  logger?: FastifyBaseLogger,
  attempts: number = 10
): PromiseResult<void> => {
  const convertedEvents = events.map(convertApiUserEventToDynamo)

  const transactionResult = await auditLogGateway.createManyUserEvents(convertedEvents)

  if (isError(transactionResult)) {
    if (isConditionalExpressionViolationError(transactionResult) || isTransactionConflictError(transactionResult)) {
      if (attempts > 1) {
        logger?.info(`Retrying ${attempts}`)
        // Wait 250 - 750ms and try again
        const delay = randomInt(250, 750)
        await new Promise((resolve) => setTimeout(resolve, delay))
        return createAuditLogUserEvents(events, auditLogGateway, logger, attempts - 1)
      }

      return new ConflictError(`Conflict writing event. Tried ${attempts} times`)
    }

    if (isTooManyEventsError(transactionResult)) {
      return new Error(`Too many actions for a dynamodb transaction: ${transactionResult.message}`)
    }

    return new Error(transactionResult.message)
  }
}

export default createAuditLogUserEvents
