import type { User } from "@moj-bichard7/common/types/User"

import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import type { ApiAuditLogEvent } from "../../../types/AuditLogEvent"
import type { TransactionConnection } from "../../../types/DatabaseGateway"

import { UnprocessableEntityError } from "../../../types/errors/UnprocessableEntityError"
import buildAuditLogEvent from "../../auditLog/buildAuditLogEvent"

export const updateTriggers = async (
  tx: TransactionConnection,
  user: User,
  unresolvedTriggerIds: number[],
  auditLogEvents: ApiAuditLogEvent[]
): PromiseResult<number> => {
  const resolver = user.username
  const resolutionTimestamp = new Date()

  const updateFields: Record<string, unknown> = {
    resolved_by: resolver,
    resolved_ts: resolutionTimestamp,
    status: ResolutionStatusNumber.Resolved
  }

  const stringifiedIds = unresolvedTriggerIds.map(String)

  const updateResult = await tx.connection`
    UPDATE br7own.error_list_triggers
    SET ${tx.connection(updateFields)}
    WHERE trigger_id = ANY(${stringifiedIds}) AND resolved_ts IS NULL AND resolved_by IS NULL
  `.catch((error: Error) => error)

  if (isError(updateResult)) {
    return new Error(`Couldn't update triggers trigger ids:${unresolvedTriggerIds}: ${updateResult.message}`)
  }

  if (updateResult.count === 0) {
    return new UnprocessableEntityError(`Couldn't update triggers ids: ${unresolvedTriggerIds}`)
  }

  auditLogEvents.push(
    buildAuditLogEvent(EventCode.TriggersResolved, EventCategory.information, "Bichard New UI", {
      auditLogVersion: 2,
      "Number Of Triggers": unresolvedTriggerIds.length,
      user: user.username
    })
  )

  return updateResult.count
}
