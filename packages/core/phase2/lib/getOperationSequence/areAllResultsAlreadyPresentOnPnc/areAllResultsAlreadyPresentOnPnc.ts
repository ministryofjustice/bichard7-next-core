import type { AnnotatedHearingOutcome } from "../../../../types/AnnotatedHearingOutcome"
import type Exception from "../../../../types/Exception"
import { ExceptionResult } from "../../../../types/Exception"
import { isNonEmptyArray } from "../../../../types/NonEmptyArray"
import isRecordableResult from "../../isRecordableResult"
import { isMatchToPncAdjAndDis } from "./isMatchToPncAdjAndDis"

const areAllResultsAlreadyPresentOnPnc = (aho: AnnotatedHearingOutcome): ExceptionResult<boolean> => {
  if (!aho.PncQuery?.pncId) {
    return { value: false, exceptions: [] }
  }

  const offences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

  const exceptions: Exception[] = []
  const allResultsOnPnc = offences.every((offence, offenceIndex) => {
    const results = offence.Result
    const courtCaseReferenceNumber = offence.CourtCaseReferenceNumber ?? undefined
    const offenceReasonSequence = offence.CriminalProsecutionReference?.OffenceReasonSequence

    if (isNonEmptyArray(results) && offenceReasonSequence) {
      const { value: matchToPncAdjAndDis, exceptions: matchToPncAdjAndDisExceptions } = isMatchToPncAdjAndDis(
        results,
        aho,
        courtCaseReferenceNumber,
        offenceIndex,
        offenceReasonSequence
      )
      exceptions.push(...matchToPncAdjAndDisExceptions)

      return matchToPncAdjAndDis
    }

    return !offence.Result.some(isRecordableResult)
  })

  return { value: allResultsOnPnc, exceptions }
}

export default areAllResultsAlreadyPresentOnPnc
