import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import type { AuditLogDynamoGatewayInterface } from "../../services/gateways/dynamo"
import type { ProjectionOptions } from "../../services/gateways/dynamo/AuditLogDynamoGateway/queryParams"
import type { OutputApiAuditLog } from "../../types/AuditLog"
import type MessageFetcher from "../../types/MessageFetcher"

import convertDynamoAuditLogToOutputApi from "../dto/convertDynamoAuditLogToOutputApi"

export default class FetchByHash implements MessageFetcher {
  constructor(
    private readonly gateway: AuditLogDynamoGatewayInterface,
    private messageId: string,
    private readonly options?: ProjectionOptions
  ) {}

  async fetch(): PromiseResult<OutputApiAuditLog[]> {
    const records = await this.gateway.fetchByHash(this.messageId, this.options)
    if (isError(records)) {
      return records
    }

    return records.map(convertDynamoAuditLogToOutputApi)
  }
}
