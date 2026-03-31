import type { MockRemandRequest } from "../../../../types/MockRemandRequest"
import {
  ARREST_SUMMONS_NUMBER_FIELD_LENGTH,
  CRIME_OFFENCE_REFERENCE_FIELD_LENGTH,
  UPDATE_TYPE,
  UPDATE_TYPE_FIELD_LENGTH
} from "../../../constants"
import generateRow from "../helpers/generateRow"

const asrSegmentGenerator = (ledsJson: MockRemandRequest): string =>
  generateRow("ASR", [
    [UPDATE_TYPE, UPDATE_TYPE_FIELD_LENGTH],
    [ledsJson.arrestSummonsNumber, ARREST_SUMMONS_NUMBER_FIELD_LENGTH],
    [ledsJson.crimeOffenceReferenceNo, CRIME_OFFENCE_REFERENCE_FIELD_LENGTH]
  ])

export default asrSegmentGenerator
