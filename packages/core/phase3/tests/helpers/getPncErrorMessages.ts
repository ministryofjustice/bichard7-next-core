import type AnnotatedPncUpdateDataset from "../../../types/AnnotatedPncUpdateDataset"
import type { PncUpdateDataset } from "../../../types/PncUpdateDataset"

const getPncErrorMessages = (message: AnnotatedPncUpdateDataset | PncUpdateDataset): string[] => {
  const exceptions =
    "PncOperations" in message ? message.Exceptions : message.AnnotatedPNCUpdateDataset.PNCUpdateDataset.Exceptions

  return exceptions.filter((exception) => "message" in exception).map((exception) => exception.message)
}

export default getPncErrorMessages
