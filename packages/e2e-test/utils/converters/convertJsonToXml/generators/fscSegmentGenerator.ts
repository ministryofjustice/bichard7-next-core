import type { MockAddDisposalRequest } from "../../../../types/MockAddDisposalRequest"
import type { MockAsnQueryResponse } from "../../../../types/MockAsnQueryResponse"
import type { MockRemandRequest } from "../../../../types/MockRemandRequest"
import type { MockSubsequentDisposalResultsRequest } from "../../../../types/MockSubsequentDisposalResultsRequest"
import { FORCE_STATION_CODE_FIELD_LENGTH, UPDATE_TYPE, UPDATE_TYPE_FIELD_LENGTH } from "../../../constants"
import generateRow from "../helpers/generateRow"

type LedsJson = MockAsnQueryResponse | MockRemandRequest | MockAddDisposalRequest | MockSubsequentDisposalResultsRequest

const fscSegmentGenerator = (ledsJson: LedsJson): string => {
  const forceStationCode = ledsJson.ownerCode

  const fscSegment = generateRow("FSC", [
    [UPDATE_TYPE, UPDATE_TYPE_FIELD_LENGTH],
    [forceStationCode, FORCE_STATION_CODE_FIELD_LENGTH]
  ])

  return fscSegment
}

export default fscSegmentGenerator
