import type { ExceptionCode } from "./ExceptionCode"
import type { Trigger } from "./Trigger"

type BichardResultType = {
  triggers: Trigger[]
  exceptions: ExceptionCode[]
}

export default BichardResultType
