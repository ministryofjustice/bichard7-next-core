import type { TriggerDto, TriggerRow } from "@moj-bichard7/common/types/Trigger"

import { ResolutionStatus } from "@moj-bichard7/common/types/ResolutionStatus"
import getShortTriggerCode from "@moj-bichard7/common/utils/getShortTriggerCode"
import getTriggerWithDescription from "@moj-bichard7/common/utils/getTriggerWithDescription"

import { resolutionStatusFromDb } from "./convertResolutionStatus"

export const convertTriggerRowToDto = (triggerRow: TriggerRow): TriggerDto => {
  return {
    createAt: triggerRow.create_ts,
    description: getTriggerWithDescription(triggerRow.trigger_code, true),
    resolvedAt: triggerRow.resolved_ts ? triggerRow.resolved_ts : undefined,
    shortTriggerCode: getShortTriggerCode(triggerRow.trigger_code),
    status: resolutionStatusFromDb(triggerRow.status) ?? ResolutionStatus.Unresolved,
    triggerCode: triggerRow.trigger_code,
    triggerId: triggerRow.trigger_id,
    triggerItemIdentity: triggerRow.trigger_item_identity ? Number(triggerRow.trigger_item_identity) : undefined
  }
}
