import type { Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import type { PncUpdateAdjudication } from "../../types/HearingDetails"

import createPoliceAdjudicationFromAho from "../../../lib/createPoliceAdjudicationFromAho/createPoliceAdjudicationFromAho"
import formatDateSpecifiedInResult from "../../../lib/results/createPoliceDisposalsFromResult/formatDateSpecifiedInResult"
import { PncUpdateType } from "../../types/HearingDetails"

export const createAdjudicationFromOffence = (
  offence: Offence,
  dateOfHearing: Date
): PncUpdateAdjudication | undefined => {
  const adjudication = createPoliceAdjudicationFromAho(offence.Result, dateOfHearing)

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
