import type { AnnotatedHearingOutcome } from "types/AnnotatedHearingOutcome"
import { ExceptionCode } from "types/ExceptionCode"
import type { CourtResultMatchingSummary } from "phase1/comparison/types/MatchingComparisonOutput"

const convictionDateMatching = (
  expected: CourtResultMatchingSummary,
  actual: CourtResultMatchingSummary,
  expectedAho: AnnotatedHearingOutcome,
  __: AnnotatedHearingOutcome,
  ___: AnnotatedHearingOutcome
): boolean => {
  if (!("exceptions" in expected)) {
    return false
  }

  const bichardRaisesHo100310 = expected.exceptions.some((exception) => exception.code === ExceptionCode.HO100310)
  const bichardRaisesHo100332 = expected.exceptions.some((exception) => exception.code === ExceptionCode.HO100332)

  const coreMatches = "offences" in actual

  const offenceIndices = expected.exceptions.map((e) => e.path[5])

  const exceptionOffences = expectedAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.filter(
    (_, index) => offenceIndices.includes(index)
  )

  const exceptionOffencesHaveConvictionDate = exceptionOffences.some((offence) => offence.ConvictionDate)

  return (bichardRaisesHo100310 || bichardRaisesHo100332) && coreMatches && exceptionOffencesHaveConvictionDate
}

export default convictionDateMatching
