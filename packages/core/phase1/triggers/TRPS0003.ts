import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { TriggerGenerator } from "../../phase1/types/TriggerGenerator"

const triggerCode = TriggerCode.TRPS0003

const generator: TriggerGenerator = (_hearingOutcome, options) => {
  if (options?.phase !== 2) {
    return []
  }

  const shouldRaiseTrigger = false
  return shouldRaiseTrigger ? [{ code: triggerCode }] : []
}

export default generator
