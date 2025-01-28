import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import type { AuditLogDynamoGatewayInterface } from "../../services/gateways/dynamo"
import type { ProjectionOptions } from "../../services/gateways/dynamo/AuditLogDynamoGateway/queryParams"
import type { OutputApiAuditLog } from "../../types/AuditLog"
import type MessageFetcher from "../../types/MessageFetcher"

import { NotFoundError } from "../../types/errors/NotFoundError"
import convertDynamoAuditLogToOutputApi from "../dto/convertDynamoAuditLogToOutputApi"

export default class FetchById implements MessageFetcher {
  constructor(
    private readonly gateway: AuditLogDynamoGatewayInterface,
    private messageId: string,
    private readonly options?: ProjectionOptions
  ) {}

  async fetch(): PromiseResult<OutputApiAuditLog | undefined> {
    const record = await this.gateway.fetchOne(this.messageId, this.options)
    if (isError(record)) {
      return record
    }

    if (record === undefined) {
      return new NotFoundError(`A message with Id ${this.messageId} does not exist in the database`)
    }

    return convertDynamoAuditLogToOutputApi(record)
  }
}
