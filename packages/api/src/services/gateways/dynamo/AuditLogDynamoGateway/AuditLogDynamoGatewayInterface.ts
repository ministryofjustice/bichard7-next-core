import type { PromiseResult } from "@moj-bichard7/common/types/Result"

import type { DynamoAuditLog } from "../../../../types/AuditLog"
import type { DynamoAuditLogEvent, DynamoAuditLogUserEvent } from "../../../../types/AuditLogEvent"
import type {
  FetchByStatusOptions,
  FetchManyOptions,
  FetchOneOptions,
  FetchRangeOptions,
  FetchUnsanitisedOptions,
  ProjectionOptions
} from "./queryParams"

export default interface AuditLogDynamoGateway {
  create(message: DynamoAuditLog): PromiseResult<DynamoAuditLog>
  createMany(messages: DynamoAuditLog[]): PromiseResult<DynamoAuditLog[]>
  createManyUserEvents(events: DynamoAuditLogUserEvent[]): PromiseResult<void>
  fetchByExternalCorrelationId(
    externalCorrelationId: string,
    options?: ProjectionOptions
  ): PromiseResult<DynamoAuditLog | null>
  fetchByHash(hash: string, options?: ProjectionOptions): PromiseResult<DynamoAuditLog[]>
  fetchByStatus(status: string, options?: FetchByStatusOptions): PromiseResult<DynamoAuditLog[]>
  fetchMany(options?: FetchManyOptions): PromiseResult<DynamoAuditLog[]>
  fetchOne(messageId: string, options?: FetchOneOptions): PromiseResult<DynamoAuditLog | undefined>
  fetchRange(options: FetchRangeOptions): PromiseResult<DynamoAuditLog[]>
  fetchUnsanitised(options?: FetchUnsanitisedOptions): PromiseResult<DynamoAuditLog[]>
  fetchVersion(messageId: string): PromiseResult<null | number>
  replaceAuditLog(message: DynamoAuditLog, version: number): PromiseResult<void>
  replaceAuditLogEvents(events: DynamoAuditLogEvent[]): PromiseResult<void>
  update(
    existing: DynamoAuditLog,
    updates: Partial<DynamoAuditLog>,
    events?: DynamoAuditLogEvent[]
  ): PromiseResult<void>
  updateSanitiseCheck(message: DynamoAuditLog, nextSanitiseCheck: Date): PromiseResult<void>
}
