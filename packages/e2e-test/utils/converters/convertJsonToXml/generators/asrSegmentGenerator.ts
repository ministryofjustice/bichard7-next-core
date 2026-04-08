import {
  ARREST_SUMMONS_NUMBER_FIELD_LENGTH,
  CRIME_OFFENCE_REFERENCE_FIELD_LENGTH,
  UPDATE_TYPE,
  UPDATE_TYPE_FIELD_LENGTH
} from "../../../constants"
import generateRow from "../helpers/generateRow"

const convertToPncAsn = (asn: string): string =>
  asn
    .split("/")
    .map((part, i) => (i === 3 ? part.replace(/^0*/g, "") : part))
    .join("/")

const asrSegmentGenerator = (asn: string, crimeOffenceReferenceNo: string): string =>
  generateRow("ASR", [
    [UPDATE_TYPE, UPDATE_TYPE_FIELD_LENGTH],
    [convertToPncAsn(asn), ARREST_SUMMONS_NUMBER_FIELD_LENGTH],
    [crimeOffenceReferenceNo, CRIME_OFFENCE_REFERENCE_FIELD_LENGTH]
  ])

export default asrSegmentGenerator
