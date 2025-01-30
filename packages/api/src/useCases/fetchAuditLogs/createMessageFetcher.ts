import type { AuditLogDynamoGatewayInterface } from "../../services/gateways/dynamo"
import type { AuditLogQueryParameters } from "../../types/AuditLogQueryParameters"
import type MessageFetcher from "../../types/MessageFetcher"

import FetchAll from "./FetchAll"
import FetchByExternalCorrelationId from "./FetchByExternalCorrelationId"
import FetchByHash from "./FetchByHash"
import FetchById from "./FetchById"
import FetchByStatus from "./FetchByStatus"
import FetchReport from "./FetchReport"
import FetchUnsanitised from "./FetchUnsanitised"

const createMessageFetcher = (
  queryParameters: AuditLogQueryParameters,
  auditLogGateway: AuditLogDynamoGatewayInterface
): Error | MessageFetcher => {
  const {
    end,
    eventsFilter,
    excludeColumns,
    externalCorrelationId,
    includeColumns,
    lastMessageId,
    limit,
    messageHash,
    messageId,
    start,
    status,
    unsanitised
  } = queryParameters

  const projection = { excludeColumns, includeColumns }
  const pagination = { lastMessageId, limit }

  if (eventsFilter) {
    if (!start || !end) {
      return new Error("Start and end dates required for eventsFilter")
    }

    if (eventsFilter === "automationReport") {
      return new FetchReport(auditLogGateway, { end, start, ...pagination }, "automationReport")
    } else if (eventsFilter === "topExceptionsReport") {
      return new FetchReport(auditLogGateway, { end, start, ...pagination }, "topExceptionsReport")
    }

    return new Error("Invalid value for 'eventsFilter' parameter")
  }

  if (unsanitised) {
    return new FetchUnsanitised(auditLogGateway, { ...pagination, ...projection })
  }

  if (messageId) {
    return new FetchById(auditLogGateway, messageId, projection)
  }

  if (messageHash) {
    return new FetchByHash(auditLogGateway, messageHash, projection)
  }

  if (externalCorrelationId) {
    return new FetchByExternalCorrelationId(auditLogGateway, externalCorrelationId, projection)
  }

  if (status) {
    return new FetchByStatus(auditLogGateway, status, { ...pagination, ...projection })
  }

  return new FetchAll(auditLogGateway, { ...pagination, ...projection })
}

export default createMessageFetcher
