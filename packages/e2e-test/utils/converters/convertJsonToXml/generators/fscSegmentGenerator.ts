import type { MockAsnQueryResponse } from "../../../../types/MockAsnQueryResponse"
import { FORCE_STATION_CODE_FIELD_LENGTH, UPDATE_TYPE, UPDATE_TYPE_FIELD_LENGTH } from "../../../constants"
import generateRow from "../helpers/generateRow"

const fscSegmentGenerator = (ledsJson: MockAsnQueryResponse): string => {
  const forceStationCode = ledsJson.ownerCode

  const fscSegment = generateRow("FSC", [
    [UPDATE_TYPE, UPDATE_TYPE_FIELD_LENGTH],
    [forceStationCode, FORCE_STATION_CODE_FIELD_LENGTH]
  ])

  return fscSegment
}

export default fscSegmentGenerator
