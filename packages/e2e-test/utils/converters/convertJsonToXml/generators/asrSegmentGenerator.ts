import * as CONSTANT from "../../../constants"
import generateRow from "../helpers/generateRow"

const convertToPncAsn = (asn: string): string =>
  asn
    .split("/")
    .map((part, i) => (i === 3 ? part.replace(/^0*/g, "") : part))
    .join("/")

const asrSegmentGenerator = (asn: string, crimeOffenceReferenceNo: string): string =>
  generateRow("ASR", [
    [CONSTANT.UPDATE_TYPE, CONSTANT.UPDATE_TYPE_FIELD_LENGTH],
    [convertToPncAsn(asn), CONSTANT.ARREST_SUMMONS_NUMBER_FIELD_LENGTH],
    [crimeOffenceReferenceNo, CONSTANT.CRIME_OFFENCE_REFERENCE_FIELD_LENGTH]
  ])

export default asrSegmentGenerator
