import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import type { ComparisonData } from "../../types/ComparisonData"
import type { CourtResultMatchingSummary } from "../../types/MatchingComparisonOutput"
import { checkIntentionalDifferenceForPhases } from "./index"

// HO200113 and HO200114 are exceptions raised when there are an invalid combination of operations generated as part of
// Phase 2. The error path for these exceptions are set on the ASN which means there can only be one set on it.

// In legacy Bichard, specifically the validateOperationSequence function at UpdateMessageSequenceBuilderImpl.java:1417,
// it returns as soon as it finds an exception. However in Core, we no longer do this and take the latest exception
// instead (HO200114).

const ho200114InsteadOfHo200113 = ({ expected, actual, phase }: ComparisonData) =>
  checkIntentionalDifferenceForPhases([2], phase, (): boolean => {
    const expectedMatchingSummary = expected.courtResultMatchingSummary as CourtResultMatchingSummary
    const actualMatchingSummary = actual.courtResultMatchingSummary as CourtResultMatchingSummary

    const bichardRaisesHo200113 =
      "exceptions" in expectedMatchingSummary &&
      expectedMatchingSummary.exceptions.some((exception) => exception.code === ExceptionCode.HO200113)
    const coreRaisesHo200114 =
      "exceptions" in actualMatchingSummary &&
      actualMatchingSummary.exceptions.some((exception) => exception.code === ExceptionCode.HO200114)

    return bichardRaisesHo200113 && coreRaisesHo200114
  })

export default ho200114InsteadOfHo200113
