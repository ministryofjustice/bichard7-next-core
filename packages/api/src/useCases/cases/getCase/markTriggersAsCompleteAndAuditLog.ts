import type { TriggerRow } from "@moj-bichard7/common/types/Trigger"
import type { User } from "@moj-bichard7/common/types/User"

import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"
import { generateTriggersAttributes } from "@moj-bichard7/common/utils/generateTriggersAttributes"

import type { ApiAuditLogEvent } from "../../../types/AuditLogEvent"
import type { TransactionConnection } from "../../../types/DatabaseGateway"

import { UnprocessableEntityError } from "../../../types/errors/UnprocessableEntityError"
import buildAuditLogEvent from "../../auditLog/buildAuditLogEvent"

export const markTriggersAsCompleteAndAuditLog = async (
  tx: TransactionConnection,
  courtCaseId: number,
  hasUnresolvedExceptions: boolean,
  user: User,
  allTriggers: TriggerRow[],
  auditLogEvents: ApiAuditLogEvent[]
): PromiseResult<number> => {
  const resolver = user.username
  const resolutionTimestamp = hasUnresolvedExceptions ? null : new Date()

  const updateFields: Record<string, unknown> = {
    resolved_ts: resolutionTimestamp,
    status: "Resolved",
    trigger_resolved_by: resolver,
    trigger_resolved_timestamp: new Date()
  }

  const updateResult = await tx.connection`
    UPDATE br7own.error_list
    SET ${tx.connection(updateFields)}
    WHERE error_id = ${courtCaseId} AND trigger_resolved_by IS NULL AND trigger_resolved_ts IS NULL
  `.catch((error: Error) => error)

  if (isError(updateResult)) {
    return new Error(`Couldn't complete triggers for case ${courtCaseId}: ${updateResult.message}`)
  }

  if (updateResult.count === 0) {
    return new UnprocessableEntityError(`Couldn't update triggers for case ${courtCaseId}`)
  }

  auditLogEvents.push(
    buildAuditLogEvent(EventCode.AllTriggersResolved, EventCategory.information, "Bichard New UI", {
      auditLogVersion: 2,
      "Number Of Triggers": allTriggers.length,
      user: user.username,
      ...generateTriggersAttributes(
        allTriggers.map((trigger) => ({
          triggerCode: trigger.trigger_code,
          triggerItemIdentity:
            trigger.trigger_item_identity === null ? undefined : Number(trigger.trigger_item_identity)
        }))
      )
    })
  )

  return updateResult.count
}
