import type { CourtResultMatchingSummary } from "src/comparison/types/MatchingComparisonOutput"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import { ExceptionCode } from "src/types/ExceptionCode"

const nonMatchingManualSequenceNumber = (
  expected: CourtResultMatchingSummary,
  actual: CourtResultMatchingSummary,
  _: AnnotatedHearingOutcome,
  __: AnnotatedHearingOutcome
): boolean => {
  if ("exceptions" in expected) {
    return false
  }

  const coreRaisesHo100320 =
    "exceptions" in actual && actual.exceptions.some((exception) => exception.code === ExceptionCode.HO100320)

  return coreRaisesHo100320
}

export default nonMatchingManualSequenceNumber
