import type { TriggerCode } from "core/common/types/TriggerCode"

export type Trigger = {
  code: TriggerCode
  offenceSequenceNumber?: number
}
