import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import type { AuditLogDynamoGatewayInterface } from "../../services/gateways/dynamo"
import type { DynamoAuditLog, OutputApiAuditLog } from "../../types/AuditLog"
import type MessageFetcher from "../../types/MessageFetcher"

import convertDynamoAuditLogToOutputApi from "../dto/convertDynamoAuditLogToOutputApi"

type FetchAllOptions = {
  excludeColumns?: string[]
  includeColumns?: string[]
  lastMessageId?: string
}

export default class FetchAll implements MessageFetcher {
  constructor(
    private readonly gateway: AuditLogDynamoGatewayInterface,
    private readonly options: FetchAllOptions = {}
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

    const records = await this.gateway.fetchMany({ lastMessage, ...this.options })
    if (isError(records)) {
      return records
    }

    return records.map(convertDynamoAuditLogToOutputApi)
  }
}
