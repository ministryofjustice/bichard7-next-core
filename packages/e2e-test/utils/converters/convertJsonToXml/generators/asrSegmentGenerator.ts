import type { MockRemandRequest } from "../../../../types/MockRemandRequest"
import { ARREST_SUMMONS_NUMBER_FIELD_LENGTH, CRIME_OFFENCE_REFERENCE_FIELD_LENGTH } from "../../../constants"
import generateRow from "../helpers/generateRow"

const asrSegmentGenerator = (ledsJson: MockRemandRequest): string => {
  const arrestSummonsNumber = ledsJson.arrestSummonsNumber
  const crimeOffenceReferenceNo = ledsJson.crimeOffenceReferenceNo

  const asrSegment = generateRow("ASR", [
    [arrestSummonsNumber, ARREST_SUMMONS_NUMBER_FIELD_LENGTH],
    [crimeOffenceReferenceNo, CRIME_OFFENCE_REFERENCE_FIELD_LENGTH]
  ])

  return asrSegment
}

export default asrSegmentGenerator
