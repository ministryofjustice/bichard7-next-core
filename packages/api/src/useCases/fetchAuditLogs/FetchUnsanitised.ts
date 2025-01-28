import type { PromiseResult } from "@moj-bichard7/common/types/Result"

import { isError } from "lodash"

import type { AuditLogDynamoGatewayInterface } from "../../services/gateways/dynamo"
import type { FetchUnsanitisedOptions } from "../../services/gateways/dynamo/AuditLogDynamoGateway/queryParams"
import type { DynamoAuditLog, OutputApiAuditLog } from "../../types/AuditLog"
import type MessageFetcher from "../../types/MessageFetcher"

import convertDynamoAuditLogToOutputApi from "../dto/convertDynamoAuditLogToOutputApi"

export default class FetchUnsanitised implements MessageFetcher {
  constructor(
    private readonly gateway: AuditLogDynamoGatewayInterface,
    private readonly options: FetchUnsanitisedOptions
  ) {}

  async fetch(): PromiseResult<OutputApiAuditLog[]> {
    let lastMessage: DynamoAuditLog | undefined

    if (this.options.lastMessageId) {
      const result = await this.gateway.fetchOne(this.options.lastMessageId, {
        includeColumns: ["isSanitised", "nextSanitiseCheck"]
      })

      if (isError(result)) {
        return result
      }

      lastMessage = result
    }

    const records = await this.gateway.fetchUnsanitised({ lastMessage, ...this.options })

    if (isError(records)) {
      return records
    }

    return records.map(convertDynamoAuditLogToOutputApi)
  }
}
