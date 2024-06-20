import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { TriggerGenerator } from "../../phase1/types/TriggerGenerator"
import { isPncUpdateDataset } from "../../types/PncUpdateDataset"

const triggerCode = TriggerCode.TRPS0004

const generator: TriggerGenerator = (hearingOutcome, options) => {
  if (options?.phase !== 2 || !isPncUpdateDataset(hearingOutcome)) {
    return []
  }

  const newremCount = hearingOutcome.PncOperations.filter((op) => op.code === "NEWREM").length
  if (newremCount > 1) {
    return [{ code: triggerCode }]
  }

  return []
}

export default generator
