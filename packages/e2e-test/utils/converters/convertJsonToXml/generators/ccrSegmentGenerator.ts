import type { MockAddDisposalRequest } from "../../../../types/MockAddDisposalRequest"
import type { MockDisposal as MockAsnQueryResponseDisposal } from "../../../../types/MockAsnQueryResponse"
import {
  COURT_CASE_REFERENCE_FIELD_LENGTH,
  CRIME_OFFENCE_REFERENCE_FIELD_LENGTH,
  UPDATE_TYPE,
  UPDATE_TYPE_FIELD_LENGTH
} from "../../../constants"
import { formatCourtCaseReference } from "../helpers/formatCourtCaseReference"
import generateRow from "../helpers/generateRow"

const ccrSegmentGenerator = (data: MockAsnQueryResponseDisposal | MockAddDisposalRequest): string => {
  const ccrSegment = generateRow("CCR", [
    [UPDATE_TYPE, UPDATE_TYPE_FIELD_LENGTH],
    [formatCourtCaseReference(data.courtCaseReference), COURT_CASE_REFERENCE_FIELD_LENGTH],
    [data.crimeOffenceReferenceNumber, CRIME_OFFENCE_REFERENCE_FIELD_LENGTH]
  ])

  return ccrSegment
}

export default ccrSegmentGenerator
