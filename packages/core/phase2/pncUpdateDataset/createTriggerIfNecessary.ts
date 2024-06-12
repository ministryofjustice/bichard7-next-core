import type TriggerCode from "bichard7-next-data-latest/types/TriggerCode"
import type { Trigger } from "../../phase1/types/Trigger"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"

const createTriggerIfNecessary = (
  triggers: Trigger[],
  triggerCode: TriggerCode,
  courtOffenceSequenceNumber: number | undefined,
  pncUpdateDataset: PncUpdateDataset,
  acquittedOnAppeal = false
): void => {
  console.log(
    "To be implemented: TriggerBuilder.java:229",
    !!triggers,
    triggerCode,
    courtOffenceSequenceNumber,
    !!pncUpdateDataset,
    acquittedOnAppeal
  )
}

export default createTriggerIfNecessary
