import type { MockAddDisposalRequest } from "../../../../types/MockAddDisposalRequest"
import {
  OFFENCE_UPDATE_TYPE,
  RCC_REFERENCE_FIELD_LENGTH,
  RCC_TEXT_FIELD_LENGTH,
  UPDATE_TYPE_FIELD_LENGTH
} from "../../../constants"
import generateRow from "../helpers/generateRow"

const rccSegmentGenerator = (mockJson: MockAddDisposalRequest): string | undefined => {
  if (!mockJson.referToCourtCase?.reference) {
    return undefined
  }

  return generateRow("RCC", [
    [OFFENCE_UPDATE_TYPE, UPDATE_TYPE_FIELD_LENGTH],
    [mockJson.referToCourtCase?.reference, RCC_REFERENCE_FIELD_LENGTH],
    ["", RCC_TEXT_FIELD_LENGTH]
  ])
}

export default rccSegmentGenerator
