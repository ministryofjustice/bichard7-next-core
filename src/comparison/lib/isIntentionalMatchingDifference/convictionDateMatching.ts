import type { CourtResultMatchingSummary } from "src/comparison/types/MatchingComparisonOutput"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "src/types/ExceptionCode"

const convictionDateMatching = (
  expected: CourtResultMatchingSummary,
  actual: CourtResultMatchingSummary,
  expectedAho: AnnotatedHearingOutcome,
  __: AnnotatedHearingOutcome
): boolean => {
  if (!("exceptions" in expected)) {
    return false
  }

  const bichardRaisesHo100310 = expected.exceptions.some((exception) => exception.code === ExceptionCode.HO100310)
  const bichardRaisesHo100332 = expected.exceptions.some((exception) => exception.code === ExceptionCode.HO100332)

  const coreMatches = "offences" in actual

  const offenceIds = expected.exceptions.map((e) => e.path[5])

  const exceptionOffences = expectedAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.filter(
    (_, id) => id in offenceIds
  )

  const exceptionOffencesHaveConvictionDate = exceptionOffences.some((offence) => offence.ConvictionDate)

  return (bichardRaisesHo100310 || bichardRaisesHo100332) && coreMatches && exceptionOffencesHaveConvictionDate
}

export default convictionDateMatching
