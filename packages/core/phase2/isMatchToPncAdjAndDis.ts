import type { AnnotatedHearingOutcome, Result } from "../types/AnnotatedHearingOutcome"
import type { NonEmptyArray } from "../types/NonEmptyArray"
import type { PncDisposal } from "../types/PncQueryResult"
import getAdjFromAho from "./getAdjFromAho"
import getCourtCaseFromQueryResults from "./getCourtCaseFromQueryResults"
import isMatchToPncAdj from "./isMatchToPncAdj"
import isMatchToPncDis from "./isMatchToPncDis"
import isRecordableResult from "./isRecordableResult"

const isMatchToPncAdjAndDis = (
  results: NonEmptyArray<Result>,
  aho: AnnotatedHearingOutcome,
  courtCaseReferenceNumber: string | undefined,
  offenceIndex: number,
  offenceReasonSequence: string | undefined
): boolean => {
  const courtCaseRef = courtCaseReferenceNumber
    ? courtCaseReferenceNumber
    : aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber

  if (!courtCaseRef) {
    return false
  }

  const courtCase = getCourtCaseFromQueryResults(courtCaseRef, aho.PncQuery)

  if (!courtCase) {
    return false
  }

  const pncOffences = courtCase.offences

  if (!pncOffences || pncOffences.length == 0) {
    return false
  }

  const adjFromAho = getAdjFromAho(results, aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing)

  const matchingPncAdjudications = pncOffences.filter((pncOffence) =>
    isMatchToPncAdj(adjFromAho, pncOffence, offenceReasonSequence)
  )

  if (!matchingPncAdjudications || matchingPncAdjudications.length == 0) {
    return false
  }
  for (const pncAdj of matchingPncAdjudications) {
    const disposals = pncAdj.disposals ? pncAdj.disposals : []
    if (allRecordableResultsMatchAPncDisposal(results, disposals, aho, offenceIndex)) {
      return true
    }
  }

  return false
}

export const allRecordableResultsMatchAPncDisposal = (
  results: Result[],
  disposals: PncDisposal[],
  aho: AnnotatedHearingOutcome,
  offenceIndex: number
): boolean => {
  return results.every((result, resultIndex) => {
    if (isRecordableResult(result)) {
      return isMatchToPncDis(disposals, aho, offenceIndex, resultIndex)
    }
    return true
  })
}

export default isMatchToPncAdjAndDis
