import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { TriggerGenerator } from "../../phase1/types/TriggerGenerator"

const triggerCode = TriggerCode.TRPS0010

const generator: TriggerGenerator = (_hearingOutcome) => {
  const shouldRaiseTrigger = false
  return shouldRaiseTrigger ? [{ code: triggerCode }] : []
}

export default generator
