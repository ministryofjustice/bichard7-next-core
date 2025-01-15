import type { Trigger, TriggerDto } from "@moj-bichard7/common/types/trigger"

import { ResolutionStatus, resolutionStatusFromDb } from "./resolutionStatusFromCaseDB"

export const convertTriggerRowToDto = (triggerRow: Trigger): TriggerDto => {
  return {
    createAt: triggerRow.create_ts,
    resolvedAt: triggerRow.resolved_ts ? triggerRow.resolved_ts : undefined,
    status: resolutionStatusFromDb(triggerRow.status) ?? ResolutionStatus.Unresolved,
    triggerCode: triggerRow.trigger_code,
    triggerId: triggerRow.trigger_id,
    triggerItemIdentity: triggerRow.trigger_item_identity ? triggerRow.trigger_item_identity : undefined
  } satisfies TriggerDto
}
