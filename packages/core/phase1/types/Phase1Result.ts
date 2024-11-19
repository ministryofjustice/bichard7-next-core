import type { z } from "zod"
import type { phase1ResultSchema } from "../schemas/phase1Result"

export enum Phase1ResultType {
  success = "success",
  exceptions = "exceptions",
  ignored = "ignored"
}

type Phase1Result = z.infer<typeof phase1ResultSchema>

export default Phase1Result
