import type { Trigger, TriggerRow } from "@moj-bichard7/common/types/Trigger"

const mapTriggerRowToTrigger = (triggerRow: TriggerRow): Trigger => ({
  createdAt: triggerRow.create_ts,
  errorId: triggerRow.error_id,
  resolvedAt: triggerRow.resolved_ts,
  resolvedBy: triggerRow.resolved_by,
  status: triggerRow.status,
  triggerCode: triggerRow.trigger_code,
  triggerId: triggerRow.trigger_id,
  triggerItemIdentity: triggerRow.trigger_item_identity
})

export default mapTriggerRowToTrigger
