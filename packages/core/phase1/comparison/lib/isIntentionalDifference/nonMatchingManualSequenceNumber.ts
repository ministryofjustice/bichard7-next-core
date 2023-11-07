import type { AnnotatedHearingOutcome } from "../../../../types/AnnotatedHearingOutcome"
import { ExceptionCode } from "../../../../types/ExceptionCode"
import type { CourtResultMatchingSummary } from "../../types/MatchingComparisonOutput"

const nonMatchingManualSequenceNumber = (
  _: CourtResultMatchingSummary,
  actual: CourtResultMatchingSummary,
  __: AnnotatedHearingOutcome,
  ___: AnnotatedHearingOutcome,
  ____: AnnotatedHearingOutcome
): boolean => {
  const coreRaisesHo100320 =
    "exceptions" in actual && actual.exceptions.some((exception) => exception.code === ExceptionCode.HO100320)

  return coreRaisesHo100320
}

export default nonMatchingManualSequenceNumber
