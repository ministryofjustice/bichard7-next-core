import type { AnnotatedHearingOutcome } from "core/phase1/src/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "core/phase1/src/types/ExceptionCode"
import type { CourtResultMatchingSummary } from "../../types/MatchingComparisonOutput"

const badManualMatch = (
  _: CourtResultMatchingSummary,
  __: CourtResultMatchingSummary,
  ___: AnnotatedHearingOutcome,
  actualAho: AnnotatedHearingOutcome,
  ____: AnnotatedHearingOutcome
): boolean => {
  if (actualAho.Exceptions.length === 0) {
    return false
  }

  const coreRaisesHo100203 = actualAho.Exceptions.some((exception) => exception.code === ExceptionCode.HO100203)

  const coreRaisesHo100228 = actualAho.Exceptions.some((exception) => exception.code === ExceptionCode.HO100228)

  return coreRaisesHo100203 || coreRaisesHo100228
}

export default badManualMatch
