import type { z } from "zod"

import type { phase1ResultSchema } from "../schemas/phase1Result"

export enum Phase1ResultType {
  exceptions = "exceptions",
  ignored = "ignored",
  success = "success"
}

type Phase1Result = z.infer<typeof phase1ResultSchema>

export default Phase1Result
