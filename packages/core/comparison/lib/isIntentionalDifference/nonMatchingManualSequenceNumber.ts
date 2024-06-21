import { ExceptionCode } from "../../../types/ExceptionCode"
import type { CourtResultMatchingSummary } from "../../types/MatchingComparisonOutput"
import type { ComparisonData } from "../../types/ComparisonData"
import { checkIntentionalDifferenceForPhases } from "./index"

const nonMatchingManualSequenceNumber = (comparisonData: ComparisonData) =>
  checkIntentionalDifferenceForPhases([1], comparisonData, ({ actual }: ComparisonData): boolean => {
    const actualMatchingSummary = actual.courtResultMatchingSummary as CourtResultMatchingSummary

    const coreRaisesHo100320 =
      "exceptions" in actualMatchingSummary &&
      actualMatchingSummary.exceptions.some((exception) => exception.code === ExceptionCode.HO100320)

    return coreRaisesHo100320
  })

export default nonMatchingManualSequenceNumber
