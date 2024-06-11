import type { Trigger } from "../../phase1/types/Trigger"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"
import generateTriggers from "../../phase1/triggers/generate"

const identifyPreUpdateTriggers = (pncUpdateDataset: PncUpdateDataset): Trigger[] => {
  return generateTriggers(pncUpdateDataset)
}

export default identifyPreUpdateTriggers
