import type AnnotatedPncUpdateDataset from "@moj-bichard7/common/types/AnnotatedPncUpdateDataset"
import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

const getPncErrorMessages = (message: AnnotatedPncUpdateDataset | PncUpdateDataset): string[] => {
  const exceptions =
    "PncOperations" in message ? message.Exceptions : message.AnnotatedPNCUpdateDataset.PNCUpdateDataset.Exceptions

  return exceptions.filter((exception) => "message" in exception).map((exception) => exception.message)
}

export default getPncErrorMessages
