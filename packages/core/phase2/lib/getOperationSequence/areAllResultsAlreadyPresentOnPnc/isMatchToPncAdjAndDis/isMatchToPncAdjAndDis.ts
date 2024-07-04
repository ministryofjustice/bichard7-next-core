import type { AnnotatedHearingOutcome, Result } from "../../../../../types/AnnotatedHearingOutcome"
import type { NonEmptyArray } from "../../../../../types/NonEmptyArray"
import type { PncDisposal } from "../../../../../types/PncQueryResult"
import isRecordableResult from "../../../isRecordableResult"
import getAdjFromAho from "./getAdjFromAho"
import isMatchToPncAdj from "./isMatchToPncAdj"
import isMatchToPncDis from "./isMatchToPncDis"

const isMatchToPncAdjAndDis = (
  results: NonEmptyArray<Result>,
  aho: AnnotatedHearingOutcome,
  courtCaseReferenceNumber: string | undefined,
  offenceIndex: number,
  offenceReasonSequence: string | undefined
): boolean => {
  const courtCaseReference =
    courtCaseReferenceNumber ?? aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber

  if (!courtCaseReference) {
    return false
  }

  const courtCase = aho.PncQuery?.courtCases?.find((x) => x.courtCaseReference === courtCaseReference)

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

  return matchingPncAdjudications.some((pncAdj) =>
    allRecordableResultsMatchAPncDisposal(results, pncAdj.disposals ?? [], aho, offenceIndex)
  )
}

export const allRecordableResultsMatchAPncDisposal = (
  results: Result[],
  disposals: PncDisposal[],
  aho: AnnotatedHearingOutcome,
  offenceIndex: number
): boolean =>
  results.every(
    (result, resultIndex) => !isRecordableResult(result) || isMatchToPncDis(disposals, aho, offenceIndex, resultIndex)
  )

export default isMatchToPncAdjAndDis
