import type { Offence } from "../../../types/AnnotatedHearingOutcome"
import type { CourtHearing } from "../../types/HearingDetails"

import { HearingDetailsType } from "../../types/HearingDetails"
import { convertHoOffenceCodeToPncFormat } from "./convertHoOffenceCodeToPncFormat"
import { preProcessOffenceReasonSequence } from "./preProcessOffenceReasonSequence"

export const createCourtHearingFromOffence = (offence: Offence): CourtHearing => ({
  offenceReason: convertHoOffenceCodeToPncFormat(offence.CriminalProsecutionReference.OffenceReason),
  courtOffenceSequenceNumber: preProcessOffenceReasonSequence(offence),
  type: HearingDetailsType.ORDINARY
})
