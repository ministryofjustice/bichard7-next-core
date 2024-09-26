import type { AnnotatedHearingOutcome } from "../../../../types/AnnotatedHearingOutcome"
import isRecordableResult from "../../isRecordableResult"
import { isMatchToPncAdjudicationAndDisposals } from "./isMatchToPncAdjudicationAndDisposals"

const areAllResultsOnPnc = (aho: AnnotatedHearingOutcome): boolean =>
  !!aho.PncQuery?.pncId &&
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.every((offence) => {
    if (offence.Result.length === 0 || !offence.CriminalProsecutionReference?.OffenceReasonSequence) {
      return !offence.Result.some(isRecordableResult)
    }

    return isMatchToPncAdjudicationAndDisposals(aho, offence)
  })

export default areAllResultsOnPnc
