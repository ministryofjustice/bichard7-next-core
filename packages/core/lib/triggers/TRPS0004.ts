import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import Phase from "../../types/Phase"
import { isPncUpdateDataset } from "../../types/PncUpdateDataset"
import type { TriggerGenerator } from "../../types/TriggerGenerator"

const triggerCode = TriggerCode.TRPS0004

const generator: TriggerGenerator = (hearingOutcome, options) => {
  if (options?.phase !== Phase.PNC_UPDATE || !isPncUpdateDataset(hearingOutcome)) {
    return []
  }

  const hasNewremOperation = hearingOutcome.PncOperations.some((op) => op.code === "NEWREM")

  return hasNewremOperation ? [{ code: triggerCode }] : []
}

export default generator
