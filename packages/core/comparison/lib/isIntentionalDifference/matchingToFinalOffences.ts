import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import { ExceptionCode } from "../../../types/ExceptionCode"
import offenceHasFinalResult from "../../../phase1/enrichAho/enrichFunctions/matchOffencesToPnc/offenceHasFinalResult"
import type { CourtResultMatchingSummary } from "../../types/MatchingComparisonOutput"

const matchingToFinalOffences = (
  expected: CourtResultMatchingSummary,
  actual: CourtResultMatchingSummary,
  __: AnnotatedHearingOutcome,
  actualAho: AnnotatedHearingOutcome
): boolean => {
  if ("exceptions" in actual) {
    return false
  }

  const bichardRaisesHo100304 =
    "exceptions" in expected && expected.exceptions.some((exception) => exception.code === ExceptionCode.HO100304)
  const bichardRaisesHo100332 =
    "exceptions" in expected && expected.exceptions.some((exception) => exception.code === ExceptionCode.HO100332)

  const pncOffences = actualAho.PncQuery?.courtCases
    ?.map((courtCase) =>
      courtCase.offences.map((pncOffence) => ({ courtCaseReference: courtCase.courtCaseReference, pncOffence }))
    )
    .flat()

  if (!pncOffences) {
    return false
  }

  const hasFinalOffences = pncOffences?.some((pncOffence) => offenceHasFinalResult(pncOffence.pncOffence))

  const allNonFinalOffencesMatched = pncOffences
    ?.filter((pncOffence) => !offenceHasFinalResult(pncOffence.pncOffence))
    .every((pncOffence) =>
      actual.offences.some(
        (match) =>
          match.addedByCourt ||
          ((match.courtCaseReference === pncOffence.courtCaseReference ||
            actual.caseReference === pncOffence.courtCaseReference) &&
            match.pncSequenceNumber === pncOffence.pncOffence.offence.sequenceNumber)
      )
    )
  return (bichardRaisesHo100304 || bichardRaisesHo100332) && hasFinalOffences && allNonFinalOffencesMatched
}

export default matchingToFinalOffences
