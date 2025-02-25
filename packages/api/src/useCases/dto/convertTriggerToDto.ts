import type { Trigger, TriggerDto } from "@moj-bichard7/common/types/Trigger"

import getShortTriggerCode from "@moj-bichard7/common/utils/getShortTriggerCode"

import { ResolutionStatus, resolutionStatusFromDb } from "./convertResolutionStatus"

export const convertTriggerToDto = (triggerRow: Trigger): TriggerDto => {
  return {
    createAt: triggerRow.create_ts,
    resolvedAt: triggerRow.resolved_ts ? triggerRow.resolved_ts : undefined,
    shortTriggerCode: getShortTriggerCode(triggerRow.trigger_code),
    status: resolutionStatusFromDb(triggerRow.status) ?? ResolutionStatus.Unresolved,
    triggerCode: triggerRow.trigger_code,
    triggerId: triggerRow.trigger_id,
    triggerItemIdentity: triggerRow.trigger_item_identity ? triggerRow.trigger_item_identity : undefined
  } satisfies TriggerDto
}
