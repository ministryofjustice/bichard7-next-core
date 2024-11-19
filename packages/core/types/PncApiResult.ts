import type { z } from "zod"
import type {
  pncApiCourtCaseSchema,
  pncApiDisposalSchema,
  pncApiOffenceSchema,
  pncApiPenaltyCaseSchema,
  pncApiResultSchema
} from "../schemas/pncApiResult"

export type PncApiOffence = z.infer<typeof pncApiOffenceSchema>
export type PncApiDisposal = z.infer<typeof pncApiDisposalSchema>
export type PncApiCourtCase = z.infer<typeof pncApiCourtCaseSchema>
export type PncApiPenaltyCase = z.infer<typeof pncApiPenaltyCaseSchema>
export type PncApiResult = z.infer<typeof pncApiResultSchema>
