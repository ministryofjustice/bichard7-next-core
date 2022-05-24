import type Exception from "./Exception"
import type { Trigger } from "./Trigger"

type BichardResultType = {
  triggers: Trigger[]
  exceptions: Exception[]
  ahoXml: string
}

export default BichardResultType
