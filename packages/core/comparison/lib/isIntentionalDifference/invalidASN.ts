import { ExceptionCode } from "../../../types/ExceptionCode"
import type { ComparisonData } from "../../types/ComparisonData"
import { checkIntentionalDifferenceForPhases } from "./index"

// Previously Bichard would not raise a HO100206 exception for an invalid ASN
// and would continue querying the PNC and getting an error. We've changed this

const invalidASN = (comparisonData: ComparisonData) =>
  checkIntentionalDifferenceForPhases([1, 2], comparisonData, ({ expected, actual }: ComparisonData): boolean => {
    const coreRaisesHo100206 = actual.aho.Exceptions.some((exception) => exception.code === ExceptionCode.HO100206)

    const bichardRaisesHo100314 = expected.aho.Exceptions.some((exception) => exception.code === ExceptionCode.HO100314)

    return coreRaisesHo100206 && bichardRaisesHo100314
  })

export default invalidASN
