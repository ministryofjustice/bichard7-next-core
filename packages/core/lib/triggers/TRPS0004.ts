import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import Phase from "../../types/Phase"
import { PncOperation } from "../../types/PncOperation"
import { isPncUpdateDataset } from "../../types/PncUpdateDataset"
import type { TriggerGenerator } from "../../types/TriggerGenerator"

const triggerCode = TriggerCode.TRPS0004
const phases: (Phase | undefined)[] = [Phase.PNC_UPDATE, Phase.PHASE_3]

const generator: TriggerGenerator = (hearingOutcome, options) => {
  if (!phases.includes(options?.phase) || !isPncUpdateDataset(hearingOutcome)) {
    return []
  }

  const remandOperations = hearingOutcome.PncOperations.filter((op) => op.code === PncOperation.REMAND)

  return remandOperations.length > 1 ? [{ code: triggerCode }] : []
}

export default generator
