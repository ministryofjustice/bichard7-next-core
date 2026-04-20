import type { MockAddDisposalRequest } from "../../../../types/MockAddDisposalRequest"
import type { MockAsnQueryResponse } from "../../../../types/MockAsnQueryResponse"
import type { MockRemandRequest } from "../../../../types/MockRemandRequest"
import type { MockSubsequentDisposalResultsRequest } from "../../../../types/MockSubsequentDisposalResultsRequest"
import * as CONSTANT from "../../../constants"
import generateRow from "../helpers/generateRow"

type MockJson = MockAsnQueryResponse | MockRemandRequest | MockAddDisposalRequest | MockSubsequentDisposalResultsRequest

const idsSegmentGenerator = (mockJson: MockJson): string => {
  const pncIdentifier = mockJson.personUrn
  const pncCheckName = mockJson.pncCheckName
  const croNumber = mockJson.croNumber

  const idsSegment = generateRow("IDS", [
    [CONSTANT.UPDATE_TYPE, CONSTANT.UPDATE_TYPE_FIELD_LENGTH],
    [pncIdentifier, CONSTANT.PNC_IDENTIFIER_FIELD_LENGTH],
    [pncCheckName, CONSTANT.PNC_CHECK_NAME_FIELD_LENGTH],
    [croNumber, CONSTANT.CRO_NUMBER_FIELD_LENGTH]
  ])

  return idsSegment
}

export default idsSegmentGenerator
