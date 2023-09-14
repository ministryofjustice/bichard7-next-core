import type { z } from "zod"
import type { phase1FailureResultSchema, phase1ResultSchema, phase1SuccessResultSchema } from "../schemas/phase1Result"

export enum Phase1ResultType {
  success = "success",
  exceptions = "exceptions",
  failure = "failure",
  ignored = "ignored"
}

export type Phase1SuccessResult = z.infer<typeof phase1SuccessResultSchema>

export type Phase1FailureResult = z.infer<typeof phase1FailureResultSchema>

type Phase1Result = z.infer<typeof phase1ResultSchema>

export default Phase1Result
