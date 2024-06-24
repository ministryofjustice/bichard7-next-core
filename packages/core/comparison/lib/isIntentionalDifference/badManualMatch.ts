import { ExceptionCode } from "../../../types/ExceptionCode"
import type { ComparisonData } from "../../types/ComparisonData"
import { checkIntentionalDifferenceForPhases } from "./index"

const badManualMatch = ({ actual, phase }: ComparisonData) =>
  checkIntentionalDifferenceForPhases([1], phase, (): boolean => {
    if (actual.aho.Exceptions.length === 0) {
      return false
    }

    const coreRaisesHo100203 = actual.aho.Exceptions.some((exception) => exception.code === ExceptionCode.HO100203)

    const coreRaisesHo100228 = actual.aho.Exceptions.some((exception) => exception.code === ExceptionCode.HO100228)

    return coreRaisesHo100203 || coreRaisesHo100228
  })

export default badManualMatch
