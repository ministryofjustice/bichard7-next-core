import type { CourtResultMatchingSummary } from "src/comparison/types/MatchingComparisonOutput"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "src/types/ExceptionCode"
import hoOffencesAreEqual from "../hoOffencesAreEqual"

// Bichard sometimes raises a HO100332 for offences that have identical results. Core detects this and
// assigns a match anyway (as it doesn't matter!)

const ho100332WithSameResults = (
  expected: CourtResultMatchingSummary,
  actual: CourtResultMatchingSummary,
  expectedAho: AnnotatedHearingOutcome,
  __: AnnotatedHearingOutcome
): boolean => {
  if (!("exceptions" in expected) || "exceptions" in actual) {
    return false
  }

  const ho100332s = expected.exceptions.filter((exception) => exception.code === ExceptionCode.HO100332)
  const bichardRaisesHo100332 = ho100332s.length > 0

  const coreMatches = !("exceptions" in actual)

  const offenceIndices = ho100332s.map((e) => e.path[5])

  const exceptionOffences = expectedAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.filter(
    (_, index) => offenceIndices.includes(index)
  )

  const ho100332OffencesHaveSameResults = exceptionOffences.every((o) => hoOffencesAreEqual(exceptionOffences[0], o))

  return bichardRaisesHo100332 && coreMatches && ho100332OffencesHaveSameResults
}

export default ho100332WithSameResults
