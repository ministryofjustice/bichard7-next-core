import type { AnnotatedHearingOutcome, Offence } from "../../../../../types/AnnotatedHearingOutcome"
import type Exception from "../../../../../types/Exception"
import type { ExceptionResult } from "../../../../../types/Exception"
import { isNonEmptyArray } from "../../../../../types/NonEmptyArray"
import areResultsMatchAPncDisposal from "./areResultsMatchingAPncDisposal"
import createPncAdjudicationFromAho from "./createPncAdjudicationFromAho"
import isMatchToPncAdjudication from "./isMatchToPncAdjudication"

const findPncCourtCase = (aho: AnnotatedHearingOutcome, offence: Offence) => {
  const courtCaseReference =
    offence.CourtCaseReferenceNumber ?? aho.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber

  return courtCaseReference
    ? aho.PncQuery?.courtCases?.find((x) => x.courtCaseReference === courtCaseReference)
    : undefined
}

const isMatchToPncAdjudicationAndDisposals = (
  aho: AnnotatedHearingOutcome,
  offence: Offence,
  offenceIndex: number
): ExceptionResult<boolean> => {
  if (!offence.Result || !isNonEmptyArray(offence.Result)) {
    return { value: false, exceptions: [] }
  }

  const pncCourtCase = findPncCourtCase(aho, offence)
  if (!pncCourtCase || pncCourtCase.offences.length === 0) {
    return { value: false, exceptions: [] }
  }

  const offenceReasonSequence = offence.CriminalProsecutionReference?.OffenceReasonSequence ?? undefined
  const adjFromAho = createPncAdjudicationFromAho(
    offence.Result,
    aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing
  )
  const exceptions: Exception[] = []
  const isMatchToPncAdjudicationAndDisposalsResult = pncCourtCase.offences.some((pncOffence) => {
    if (!isMatchToPncAdjudication(adjFromAho, pncOffence, offenceReasonSequence)) {
      return false
    }

    const pncDisposalsMatchResult = areResultsMatchAPncDisposal(offence, offenceIndex, pncOffence.disposals ?? [])
    exceptions.push(...pncDisposalsMatchResult.exceptions)

    return pncDisposalsMatchResult.value
  })

  return { value: isMatchToPncAdjudicationAndDisposalsResult, exceptions }
}

export default isMatchToPncAdjudicationAndDisposals
