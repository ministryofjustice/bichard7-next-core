import { ExceptionCode } from "../../../types/ExceptionCode"
import type { IntentionalDifference } from "../../types/IntentionalDifference"

const badManualMatch = ({ actual }: IntentionalDifference): boolean => {
  if (actual.aho.Exceptions.length === 0) {
    return false
  }

  const coreRaisesHo100203 = actual.aho.Exceptions.some((exception) => exception.code === ExceptionCode.HO100203)

  const coreRaisesHo100228 = actual.aho.Exceptions.some((exception) => exception.code === ExceptionCode.HO100228)

  return coreRaisesHo100203 || coreRaisesHo100228
}

export default badManualMatch
