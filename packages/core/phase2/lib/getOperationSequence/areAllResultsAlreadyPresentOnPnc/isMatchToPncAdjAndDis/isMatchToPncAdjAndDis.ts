import type { AnnotatedHearingOutcome, Result } from "../../../../../types/AnnotatedHearingOutcome"
import type Exception from "../../../../../types/Exception"
import type { ExceptionResult } from "../../../../../types/Exception"
import type { NonEmptyArray } from "../../../../../types/NonEmptyArray"
import allRecordableResultsMatchAPncDisposal from "./allRecordableResultsMatchAPncDisposal"
import getAdjFromAho from "./getAdjFromAho"
import isMatchToPncAdj from "./isMatchToPncAdj"

const isMatchToPncAdjAndDis = (
  results: NonEmptyArray<Result>,
  aho: AnnotatedHearingOutcome,
  courtCaseReferenceNumber: string | undefined,
  offenceIndex: number,
  offenceReasonSequence: string | undefined
): ExceptionResult<boolean> => {
  const courtCaseReference =
    courtCaseReferenceNumber ?? aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber

  if (!courtCaseReference) {
    return { value: false, exceptions: [] }
  }

  const courtCase = aho.PncQuery?.courtCases?.find((x) => x.courtCaseReference === courtCaseReference)

  if (!courtCase) {
    return { value: false, exceptions: [] }
  }

  const pncOffences = courtCase.offences

  if (!pncOffences || pncOffences.length == 0) {
    return { value: false, exceptions: [] }
  }

  const adjFromAho = getAdjFromAho(results, aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing)

  const matchingPncAdjudications = pncOffences.filter((pncOffence) =>
    isMatchToPncAdj(adjFromAho, pncOffence, offenceReasonSequence)
  )

  if (!matchingPncAdjudications || matchingPncAdjudications.length == 0) {
    return { value: false, exceptions: [] }
  }

  const exceptions: Exception[] = []
  const isThereMatchingPncAdjudications = matchingPncAdjudications.some((pncAdj) => {
    const { value: allPncDisposalsMatch, exceptions: allPncDisposalsMatchExceptions } = allRecordableResultsMatchAPncDisposal(
      results,
      pncAdj.disposals ?? [],
      aho,
      offenceIndex
    )
    exceptions.push(...allPncDisposalsMatchExceptions)

    return allPncDisposalsMatch
  })

  return { value: isThereMatchingPncAdjudications, exceptions }
}

export default isMatchToPncAdjAndDis
