import type { MockAddDisposalRequest } from "../../../../types/MockAddDisposalRequest"
import type { MockAsnQueryResponse } from "../../../../types/MockAsnQueryResponse"
import type { MockRemandRequest } from "../../../../types/MockRemandRequest"
import * as CONSTANT from "../../../constants"
import generateRow from "../helpers/generateRow"

type LedsJson = MockAsnQueryResponse | MockRemandRequest | MockAddDisposalRequest

const idsSegmentGenerator = (ledsJson: LedsJson): string => {
  const pncIdentifier = ledsJson.personUrn
  const pncCheckName = ledsJson.pncCheckName
  const croNumber = ledsJson.croNumber

  const idsSegment = generateRow("IDS", [
    [CONSTANT.UPDATE_TYPE, CONSTANT.UPDATE_TYPE_FIELD_LENGTH],
    [pncIdentifier, CONSTANT.PNC_IDENTIFIER_FIELD_LENGTH],
    [pncCheckName, CONSTANT.PNC_CHECK_NAME_FIELD_LENGTH],
    [croNumber, CONSTANT.CRO_NUMBER_FIELD_LENGTH]
  ])

  return idsSegment
}

export default idsSegmentGenerator
