import type { ArrestOffence } from "@moj-bichard7/core/types/leds/AddDisposalRequest"
import { COURT_REFERENCE_NUMBER_FIELD_LENGTH, OFFENCE_QUALIFIER_FIELD_LENGTH } from "../../../constants"
import generateRow from "../helpers/generateRow"

const cchSegmentGenerator = (offence: ArrestOffence): string =>
  generateRow("CCH", [
    [String(offence.courtOffenceSequenceNumber), COURT_REFERENCE_NUMBER_FIELD_LENGTH],
    [String(offence.offenceCode), OFFENCE_QUALIFIER_FIELD_LENGTH]
  ])

export default cchSegmentGenerator
