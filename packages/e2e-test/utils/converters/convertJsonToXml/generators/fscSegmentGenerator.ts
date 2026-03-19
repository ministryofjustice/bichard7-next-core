import type { AsnQueryResponseExtended } from "../../../../types/AsnQueryResponseExtended"
import { FORCE_STATION_CODE_FIELD_LENGTH, UPDATE_TYPE_FIELD_LENGTH } from "../../../constants"
import generateRow from "../helpers/generateRow"

const fscSegmentGenerator = (ledsJson: AsnQueryResponseExtended): string => {
  const updateType = ledsJson.updateType
  const forceStationCode = ledsJson.ownerCode

  const fscSegment = generateRow("FSC", [
    [updateType, UPDATE_TYPE_FIELD_LENGTH],
    [forceStationCode, FORCE_STATION_CODE_FIELD_LENGTH]
  ])

  return fscSegment
}

export default fscSegmentGenerator
