import type { FastifyBaseLogger } from "fastify"

import AuditLogStatus from "@moj-bichard7/common/types/AuditLogStatus"
import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import type AuditLogDynamoGateway from "../services/gateways/dynamo/AuditLogDynamoGateway/AuditLogDynamoGatewayInterface"
import type { DynamoAuditLog, InputApiAuditLog, OutputApiAuditLog } from "../types/AuditLog"

import { isConditionalExpressionViolationError } from "../services/gateways/dynamo"
import ConflictError from "../types/errors/ConflictError"
import PncStatus from "../types/PncStatus"
import TriggerStatus from "../types/TriggerStatus"
import convertDynamoAuditLogToOutputApi from "./dto/convertDynamoAuditLogToOutputApi"

const convertInputApiAuditLogToDynamoAuditLog = (input: InputApiAuditLog): DynamoAuditLog => ({
  events: [],
  eventsCount: 0,
  isSanitised: 0,
  nextSanitiseCheck: new Date().toISOString(),
  version: 0,
  ...input,
  pncStatus: PncStatus.Processing,
  status: AuditLogStatus.Processing,
  triggerStatus: TriggerStatus.NoTriggers
})

const createAuditLog = async (
  auditLog: InputApiAuditLog,
  auditLogGateway: AuditLogDynamoGateway,
  logger?: FastifyBaseLogger
): PromiseResult<OutputApiAuditLog> => {
  const dynamoAuditLog = convertInputApiAuditLogToDynamoAuditLog(auditLog)

  // Check message hash doesn't already exist
  const fetchByHashResult = await auditLogGateway.fetchByHash(auditLog.messageHash)

  if (isError(fetchByHashResult)) {
    logger?.error("Error validating message hash: %o", fetchByHashResult)
    return fetchByHashResult
  } else if (fetchByHashResult.length) {
    dynamoAuditLog.status = AuditLogStatus.Duplicate
    dynamoAuditLog.pncStatus = PncStatus.Duplicate
    dynamoAuditLog.triggerStatus = TriggerStatus.Duplicate
  }

  const result = await auditLogGateway.create(dynamoAuditLog)

  if (isError(result)) {
    if (isConditionalExpressionViolationError(result)) {
      return new ConflictError(`A message with Id ${auditLog.messageId} already exists in the database`)
    }

    logger?.error("Error creating audit log: %s", result.message)
    return result
  }

  return convertDynamoAuditLogToOutputApi(result)
}

export default createAuditLog
