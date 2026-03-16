import type { PromiseResult } from "@moj-bichard7/common/types/Result"

import { isError } from "@moj-bichard7/common/types/Result"

import type { AuditLogDynamoGateway } from "../../services/gateways/dynamo"
import type { DynamoAuditLogUserEvent } from "../../types/AuditLogEvent"

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

export const getAuditLogUserEvents = async (
  auditLogGateway: AuditLogDynamoGateway,
  eventCode: string,
  maxAttempts: number = 5,
  baseDelayMs: number = 10
): PromiseResult<DynamoAuditLogUserEvent[]> => {
  const attempts = Array.from({ length: maxAttempts }).entries()

  for (const [index] of attempts) {
    const auditLogResults = await auditLogGateway.getUserEvents(eventCode)

    if (isError(auditLogResults)) {
      return auditLogResults
    }

    if (auditLogResults.length > 0) {
      return auditLogResults
    }

    if (index < maxAttempts - 1) {
      const backoffDelay = baseDelayMs * 2 ** index
      await delay(backoffDelay)
    }
  }

  return new Error(`Failed to get user log events after ${maxAttempts} attempts.`)
}
