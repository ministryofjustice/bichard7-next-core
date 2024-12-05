import type { z } from "zod"

import type { phase2ResultSchema } from "../schemas/phase2Result"

export enum Phase2ResultType {
  exceptions = "exceptions",
  ignored = "ignored",
  success = "success"
}

type Phase2Result = z.infer<typeof phase2ResultSchema>

export default Phase2Result
