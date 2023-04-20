import type { CourtResultMatchingSummary } from "src/comparison/types/MatchingComparisonOutput"
import { ExceptionCode } from "src/types/ExceptionCode"

const perfectMatchHo100310 = (expected: CourtResultMatchingSummary, actual: CourtResultMatchingSummary): boolean => {
  if ("exceptions" in actual || !("exceptions" in expected)) {
    return false
  }
  const perfectMatch = actual.offences.every(
    (offence) => offence.hoSequenceNumber === offence.pncSequenceNumber || offence.addedByCourt
  )
  const hasHo100310 = expected.exceptions.some((exception) => exception.code === ExceptionCode.HO100310)
  return perfectMatch && hasHo100310
}

export default perfectMatchHo100310
