import type { Trigger, TriggerRow } from "@moj-bichard7/common/types/Trigger"

const mapTriggerToTriggerRow = (trigger: Trigger): TriggerRow => ({
  create_ts: trigger.createdAt,
  error_id: trigger.errorId,
  resolved_by: trigger.resolvedBy,
  resolved_ts: trigger.resolvedAt,
  status: trigger.status,
  trigger_code: trigger.triggerCode,
  trigger_id: trigger.triggerId,
  trigger_item_identity: trigger.triggerItemIdentity
})

export default mapTriggerToTriggerRow
