import type { Offence } from "../../../types/AnnotatedHearingOutcome"
import type { Adjudication } from "../../types/HearingDetails"

import createPncAdjudicationFromAho from "../../../phase2/lib/createPncAdjudicationFromAho"
import formatDateSpecifiedInResult from "../../../phase2/lib/createPncDisposalsFromResult/formatDateSpecifiedInResult"
import { HearingDetailsType } from "../../types/HearingDetails"

export const createAdjudicationFromOffence = (offence: Offence, dateOfHearing: Date): Adjudication | undefined => {
  const adjudication = createPncAdjudicationFromAho(offence.Result, dateOfHearing)

  if (adjudication) {
    return {
      hearingDate: adjudication.sentenceDate ? formatDateSpecifiedInResult(adjudication.sentenceDate, true) : "",
      numberOffencesTakenIntoAccount: adjudication.offenceTICNumber?.toString().padStart(4, "0") ?? "",
      pleaStatus: adjudication.plea,
      type: HearingDetailsType.ADJUDICATION,
      verdict: adjudication.verdict
    }
  }
}
