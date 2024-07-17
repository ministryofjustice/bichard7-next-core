import Exception, { ExceptionResult } from "../../../../phase1/types/Exception"
import type { AnnotatedHearingOutcome } from "../../../../types/AnnotatedHearingOutcome"
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

    if (isNonEmptyArray(results) && !!offenceReasonSequence) {
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
