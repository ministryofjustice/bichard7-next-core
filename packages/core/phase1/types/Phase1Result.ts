import type { z } from "zod"
import type {
  persistablePhase1ResultSchema,
  phase1ResultSchema,
  phase1SuccessResultSchema,
  validPhase1ResultSchema
} from "../schemas/phase1Result"

export enum Phase1ResultType {
  success = "success",
  exceptions = "exceptions",
  ignored = "ignored"
}

export type Phase1SuccessResult = z.infer<typeof phase1SuccessResultSchema>

export type PersistablePhase1Result = z.infer<typeof persistablePhase1ResultSchema>

type Phase1Result = z.infer<typeof phase1ResultSchema>

export type ValidPhase1Result = z.infer<typeof validPhase1ResultSchema>

export default Phase1Result
