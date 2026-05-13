import type { MockDisposal } from "../../../../types/MockAsnQueryResponse"
import * as CONSTANT from "../../../constants"
import generateRow from "../helpers/generateRow"

const pcrSegmentGenerator = (disposal: MockDisposal): string => {
  return generateRow("PCR", [
    [CONSTANT.UPDATE_TYPE, CONSTANT.UPDATE_TYPE_FIELD_LENGTH],
    [disposal.penaltyCaseRefNo, CONSTANT.PENALTY_NOTICE_CASE_REF_FIELD_LENGTH]
  ])
}

export default pcrSegmentGenerator
