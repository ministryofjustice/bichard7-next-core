import type { Offence } from "@moj-bichard7/core/types/leds/DisposalRequest"
import * as CONSTANT from "../../../constants"
import { padSequence, toApcoOffenceCode } from "../helpers/formatters"
import generateRow from "../helpers/generateRow"

const cchSegmentGenerator = (offence: Offence): string =>
  generateRow("CCH", [
    [CONSTANT.UPDATE_TYPE, CONSTANT.UPDATE_TYPE_FIELD_LENGTH],
    [padSequence(offence.courtOffenceSequenceNumber), CONSTANT.COURT_REFERENCE_NUMBER_FIELD_LENGTH],
    ["", CONSTANT.OFFENCE_QUALIFIER_FIELD_LENGTH],
    [toApcoOffenceCode(offence.npccOffenceCode), CONSTANT.CCH_ACPO_OFFENCE_CODE_FIELD_LENGTH],
    [String(offence.cjsOffenceCode), CONSTANT.CJS_OFFENCE_CODE_FIELD_LENGTH]
  ])

export default cchSegmentGenerator
