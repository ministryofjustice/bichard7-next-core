import type { Trigger, TriggerDto } from "@moj-bichard7/common/types/Trigger"

import getShortTriggerCode from "@moj-bichard7/common/utils/getShortTriggerCode"
import getTriggerWithDescription from "@moj-bichard7/common/utils/getTriggerWithDescription"

import { ResolutionStatus, resolutionStatusFromDb } from "./convertResolutionStatus"

export const convertTriggerToDto = (trigger: Trigger): TriggerDto => {
  return {
    createAt: trigger.createAt,
    description: getTriggerWithDescription(trigger.triggerCode, true),
    resolvedAt: trigger.resolvedAt ? trigger.resolvedAt : undefined,
    shortTriggerCode: getShortTriggerCode(trigger.triggerCode),
    status: resolutionStatusFromDb(trigger.status) ?? ResolutionStatus.Unresolved,
    triggerCode: trigger.triggerCode,
    triggerId: trigger.triggerId,
    triggerItemIdentity: trigger.triggerItemIdentity ? Number(trigger.triggerItemIdentity) : undefined
  }
}
