import type { Offence } from "../../../types/AnnotatedHearingOutcome"
import type { PncUpdateAdjudication } from "../../types/HearingDetails"

import formatDateSpecifiedInResult from "../../../lib/createPncDisposalsFromResult/formatDateSpecifiedInResult"
import createPncAdjudicationFromAho from "../../../phase2/lib/createPncAdjudicationFromAho"
import { PncUpdateType } from "../../types/HearingDetails"

export const createAdjudicationFromOffence = (
  offence: Offence,
  dateOfHearing: Date
): PncUpdateAdjudication | undefined => {
  const adjudication = createPncAdjudicationFromAho(offence.Result, dateOfHearing)

  if (adjudication) {
    return {
      hearingDate: adjudication.sentenceDate ? formatDateSpecifiedInResult(adjudication.sentenceDate, true) : "",
      numberOffencesTakenIntoAccount: adjudication.offenceTICNumber.toString().padStart(4, "0"),
      pleaStatus: adjudication.plea,
      type: PncUpdateType.ADJUDICATION,
      verdict: adjudication.verdict
    }
  }
}
