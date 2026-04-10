import type { MockAddDisposalRequest } from "../../../../types/MockAddDisposalRequest"
import type { MockDisposal as MockAsnQueryResponseDisposal } from "../../../../types/MockAsnQueryResponse"
import * as CONSTANT from "../../../constants"
import { formatCourtCaseReference } from "../helpers/formatCourtCaseReference"
import generateRow from "../helpers/generateRow"

const ccrSegmentGenerator = (data: MockAsnQueryResponseDisposal | MockAddDisposalRequest): string => {
  const ccrSegment = generateRow("CCR", [
    [CONSTANT.UPDATE_TYPE, CONSTANT.UPDATE_TYPE_FIELD_LENGTH],
    [formatCourtCaseReference(data.courtCaseReference), CONSTANT.COURT_CASE_REFERENCE_FIELD_LENGTH],
    [data.crimeOffenceReferenceNumber, CONSTANT.CRIME_OFFENCE_REFERENCE_FIELD_LENGTH]
  ])

  return ccrSegment
}

export default ccrSegmentGenerator
