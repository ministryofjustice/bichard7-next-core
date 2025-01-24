import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import type { AuditLogDynamoGatewayInterface } from "../../services/gateways/dynamo"
import type { ProjectionOptions } from "../../services/gateways/dynamo/AuditLogDynamoGateway/queryParams"
import type { OutputApiAuditLog } from "../../types/AuditLog"
import type MessageFetcher from "../../types/MessageFetcher"

import convertDynamoAuditLogToOutputApi from "../dto/convertDynamoAuditLogToOutputApi"

export default class FetchByExternalCorrelationId implements MessageFetcher {
  constructor(
    private readonly gateway: AuditLogDynamoGatewayInterface,
    private externalCorrelationId: string,
    private readonly options?: ProjectionOptions
  ) {}

  async fetch(): PromiseResult<null | OutputApiAuditLog> {
    const record = await this.gateway.fetchByExternalCorrelationId(this.externalCorrelationId, this.options)
    if (isError(record) || record === null) {
      return record
    }

    return convertDynamoAuditLogToOutputApi(record)
  }
}
