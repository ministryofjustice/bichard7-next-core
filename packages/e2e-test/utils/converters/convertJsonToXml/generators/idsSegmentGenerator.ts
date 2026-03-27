import type { MockAddDisposalRequest } from "../../../../types/MockAddDisposalRequest"
import type { MockAsnQueryResponse } from "../../../../types/MockAsnQueryResponse"
import type { MockRemandRequest } from "../../../../types/MockRemandRequest"
import {
  CRO_NUMBER_FIELD_LENGTH,
  PNC_CHECK_NAME_FIELD_LENGTH,
  PNC_IDENTIFIER_FIELD_LENGTH,
  UPDATE_TYPE,
  UPDATE_TYPE_FIELD_LENGTH
} from "../../../constants"
import generateRow from "../helpers/generateRow"

type LedsJson = MockAsnQueryResponse | MockRemandRequest | MockAddDisposalRequest

const idsSegmentGenerator = (ledsJson: LedsJson): string => {
  const pncIdentifier = ledsJson.personUrn
  const pncCheckName = ledsJson.pncCheckName
  const croNumber = ledsJson.croNumber

  const idsSegment = generateRow("IDS", [
    [UPDATE_TYPE, UPDATE_TYPE_FIELD_LENGTH],
    [pncIdentifier, PNC_IDENTIFIER_FIELD_LENGTH],
    [pncCheckName, PNC_CHECK_NAME_FIELD_LENGTH],
    [croNumber, CRO_NUMBER_FIELD_LENGTH]
  ])

  return idsSegment
}

export default idsSegmentGenerator
