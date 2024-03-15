import type { z } from "zod"
import type { phase2ResultSchema } from "../../phase1/schemas/phase2Result"

export enum Phase2ResultType {
  success = "success",
  exceptions = "exceptions",
  ignored = "ignored"
}

type Phase2Result = z.infer<typeof phase2ResultSchema>

export default Phase2Result
