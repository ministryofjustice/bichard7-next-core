import type {
  pncApiCourtCaseSchema,
  pncApiDisposalSchema,
  pncApiOffenceSchema,
  pncApiPenaltyCaseSchema,
  pncApiResultSchema
} from "@moj-bichard7/core/phase1/schemas/pncApiResult"
import type { z } from "zod"

export type PncApiOffence = z.infer<typeof pncApiOffenceSchema>
export type PncApiDisposal = z.infer<typeof pncApiDisposalSchema>
export type PncApiCourtCase = z.infer<typeof pncApiCourtCaseSchema>
export type PncApiPenaltyCase = z.infer<typeof pncApiPenaltyCaseSchema>
export type PncApiResult = z.infer<typeof pncApiResultSchema>
