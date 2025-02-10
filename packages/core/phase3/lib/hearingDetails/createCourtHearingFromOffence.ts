import type { Offence } from "../../../types/AnnotatedHearingOutcome"
import type { PncUpdateCourtHearing } from "../../types/HearingDetails"

import getOffenceCode from "../../../lib/offences/getOffenceCode"
import { PncUpdateType } from "../../types/HearingDetails"
import { preProcessOffenceReasonSequence } from "./preProcessOffenceReasonSequence"

export const createCourtHearingFromOffence = (offence: Offence): PncUpdateCourtHearing => ({
  offenceReason: getOffenceCode(offence) ?? "",
  courtOffenceSequenceNumber: preProcessOffenceReasonSequence(offence),
  type: PncUpdateType.ORDINARY
})
