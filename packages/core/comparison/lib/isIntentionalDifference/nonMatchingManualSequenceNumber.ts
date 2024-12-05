import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import type { ComparisonData } from "../../types/ComparisonData"
import type { CourtResultMatchingSummary } from "../../types/MatchingComparisonOutput"

import { checkIntentionalDifferenceForPhases } from "./index"

const nonMatchingManualSequenceNumber = ({ actual, phase }: ComparisonData) =>
  checkIntentionalDifferenceForPhases([1], phase, (): boolean => {
    const actualMatchingSummary = actual.courtResultMatchingSummary as CourtResultMatchingSummary

    const coreRaisesHo100320 =
      "exceptions" in actualMatchingSummary &&
      actualMatchingSummary.exceptions.some((exception) => exception.code === ExceptionCode.HO100320)

    return coreRaisesHo100320
  })

export default nonMatchingManualSequenceNumber
