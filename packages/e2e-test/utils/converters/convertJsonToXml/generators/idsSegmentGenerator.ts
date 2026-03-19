import type { AsnQueryResponseExtended } from "../../../../types/AsnQueryResponseExtended"
import {
  CRO_NUMBER_FIELD_LENGTH,
  PNC_CHECK_NAME_FIELD_LENGTH,
  PNC_IDENTIFIER_FIELD_LENGTH,
  UPDATE_TYPE_FIELD_LENGTH
} from "../../../constants"
import generateRow from "../helpers/generateRow"

const idsSegmentGenerator = (ledsJson: AsnQueryResponseExtended): string => {
  const updateType = ledsJson.updateType
  const pncIdentifier = ledsJson.personUrn
  const pncCheckName = ledsJson.pncCheckName
  const croNumber = ledsJson.croNumber

  const idsSegment = generateRow("IDS", [
    [updateType, UPDATE_TYPE_FIELD_LENGTH],
    [pncIdentifier, PNC_IDENTIFIER_FIELD_LENGTH],
    [pncCheckName, PNC_CHECK_NAME_FIELD_LENGTH],
    [croNumber, CRO_NUMBER_FIELD_LENGTH]
  ])

  return idsSegment
}

export default idsSegmentGenerator
