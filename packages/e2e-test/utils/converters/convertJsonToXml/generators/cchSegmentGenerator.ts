import type { Offence } from "@moj-bichard7/core/types/leds/DisposalRequest"
import { COURT_REFERENCE_NUMBER_FIELD_LENGTH, OFFENCE_QUALIFIER_FIELD_LENGTH } from "../../../constants"
import generateRow from "../helpers/generateRow"

const cchSegmentGenerator = (offence: Offence): string =>
  generateRow("CCH", [
    [String(offence.courtOffenceSequenceNumber), COURT_REFERENCE_NUMBER_FIELD_LENGTH],
    [String(offence.cjsOffenceCode), OFFENCE_QUALIFIER_FIELD_LENGTH]
  ])

export default cchSegmentGenerator
