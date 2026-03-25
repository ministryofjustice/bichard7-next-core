import type { MockDisposal } from "../../../../types/MockAsnQueryResponse"
import {
  COURT_CASE_REFERENCE_FIELD_LENGTH,
  CRIME_OFFENCE_REFERENCE_FIELD_LENGTH,
  UPDATE_TYPE_FIELD_LENGTH
} from "../../../constants"
import { formatCourtCaseReference } from "../helpers/formatCourtCaseReference"
import generateRow from "../helpers/generateRow"

const ccrSegmentGenerator = (updateType: string | undefined, disposal: MockDisposal): string => {
  const ccrSegment = generateRow("CCR", [
    [updateType, UPDATE_TYPE_FIELD_LENGTH],
    [formatCourtCaseReference(disposal.courtCaseReference), COURT_CASE_REFERENCE_FIELD_LENGTH],
    [disposal.crimeOffenceReferenceNumber, CRIME_OFFENCE_REFERENCE_FIELD_LENGTH]
  ])

  return ccrSegment
}

export default ccrSegmentGenerator
