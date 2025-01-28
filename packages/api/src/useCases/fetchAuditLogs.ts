import type { FastifyBaseLogger } from "fastify"

import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import type AuditLogDynamoGateway from "../services/gateways/dynamo/AuditLogDynamoGateway/AuditLogDynamoGatewayInterface"
import type { OutputApiAuditLog } from "../types/AuditLog"
import type { AuditLogQueryParameters } from "../types/AuditLogQueryParameters"

import createMessageFetcher from "./fetchAuditLogs/createMessageFetcher"

const fetchAuditLogs = async (
  queryParameters: AuditLogQueryParameters,
  auditLogGateway: AuditLogDynamoGateway,
  _logger: FastifyBaseLogger
): PromiseResult<OutputApiAuditLog[]> => {
  const messageFetcher = createMessageFetcher(queryParameters, auditLogGateway)

  if (isError(messageFetcher)) {
    return messageFetcher
  }

  const messageFetcherResult = await messageFetcher.fetch()

  if (isError(messageFetcherResult)) {
    return messageFetcherResult
  }

  if (!messageFetcherResult) {
    return []
  }

  const messages = Array.isArray(messageFetcherResult) ? messageFetcherResult : [messageFetcherResult]

  return messages
}

export default fetchAuditLogs
