import type { TriggerGenerator } from "../../phase1/types/TriggerGenerator"
import { TriggerCode } from "../../types/TriggerCode"

const triggerCode = TriggerCode.TRPS0013

const generator: TriggerGenerator = (_hearingOutcome) => {
  const shouldRaiseTrigger = false
  return shouldRaiseTrigger ? [{ code: triggerCode }] : []
}

export default generator
