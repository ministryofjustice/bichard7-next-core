import type { CourtResultMatchingSummary } from "src/comparison/types/MatchingComparisonOutput"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "src/types/ExceptionCode"

const badManualMatch = (
  _: CourtResultMatchingSummary,
  __: CourtResultMatchingSummary,
  ___: AnnotatedHearingOutcome,
  actualAho: AnnotatedHearingOutcome
): boolean => {
  if (actualAho.Exceptions.length === 0) {
    return false
  }

  const coreRaisesHo100203 = actualAho.Exceptions.some((exception) => exception.code === ExceptionCode.HO100203)

  const coreRaisesHo100228 = actualAho.Exceptions.some((exception) => exception.code === ExceptionCode.HO100228)

  return coreRaisesHo100203 || coreRaisesHo100228
}

export default badManualMatch
