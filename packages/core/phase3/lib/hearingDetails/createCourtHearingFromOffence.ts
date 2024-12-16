import type { Offence } from "../../../types/AnnotatedHearingOutcome"
import type { CourtHearing } from "../../types/HearingDetails"

import getOffenceCode from "../../../phase1/lib/offence/getOffenceCode"
import { HearingDetailsType } from "../../types/HearingDetails"
import { preProcessOffenceReasonSequence } from "./preProcessOffenceReasonSequence"

export const createCourtHearingFromOffence = (offence: Offence): CourtHearing => ({
  offenceReason: getOffenceCode(offence) ?? "",
  courtOffenceSequenceNumber: preProcessOffenceReasonSequence(offence),
  type: HearingDetailsType.ORDINARY
})
