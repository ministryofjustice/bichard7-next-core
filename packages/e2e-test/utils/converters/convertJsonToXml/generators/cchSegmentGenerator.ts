import type { Offence } from "@moj-bichard7/core/types/leds/DisposalRequest"
import * as C from "../../../constants"
import { padSequence, toApcoOffenceCode } from "../helpers/formatters"
import generateRow from "../helpers/generateRow"

const cchSegmentGenerator = (offence: Offence): string =>
  generateRow("CCH", [
    [C.UPDATE_TYPE, C.UPDATE_TYPE_FIELD_LENGTH],
    [padSequence(offence.courtOffenceSequenceNumber), C.COURT_REFERENCE_NUMBER_FIELD_LENGTH],
    ["", C.OFFENCE_QUALIFIER_FIELD_LENGTH],
    [toApcoOffenceCode(offence.npccOffenceCode), C.CCH_ACPO_OFFENCE_CODE_FIELD_LENGTH],
    [String(offence.cjsOffenceCode), C.CJS_OFFENCE_CODE_FIELD_LENGTH]
  ])

export default cchSegmentGenerator
