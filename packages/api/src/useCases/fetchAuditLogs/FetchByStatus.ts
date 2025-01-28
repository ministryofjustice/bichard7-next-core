import type { PromiseResult } from "@moj-bichard7/common/types/Result"

import { isError } from "lodash"

import type { AuditLogDynamoGatewayInterface } from "../../services/gateways/dynamo"
import type { FetchByStatusOptions } from "../../services/gateways/dynamo/AuditLogDynamoGateway/queryParams"
import type { DynamoAuditLog, OutputApiAuditLog } from "../../types/AuditLog"
import type MessageFetcher from "../../types/MessageFetcher"

import convertDynamoAuditLogToOutputApi from "../dto/convertDynamoAuditLogToOutputApi"

export default class FetchByStatus implements MessageFetcher {
  constructor(
    private readonly gateway: AuditLogDynamoGatewayInterface,
    private status: string,
    private readonly options: FetchByStatusOptions = {}
  ) {}

  async fetch(): PromiseResult<OutputApiAuditLog[]> {
    let lastMessage: DynamoAuditLog | undefined

    if (this.options.lastMessageId) {
      const result = await this.gateway.fetchOne(this.options.lastMessageId)

      if (isError(result)) {
        return result
      }

      lastMessage = result
    }

    if (isError(lastMessage)) {
      return lastMessage
    }

    const records = await this.gateway.fetchByStatus(this.status, { ...this.options, lastMessage })
    if (isError(records)) {
      return records
    }

    return records.map(convertDynamoAuditLogToOutputApi)
  }
}
