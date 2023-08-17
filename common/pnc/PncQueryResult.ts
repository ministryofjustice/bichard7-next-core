import type {
  pncAdjudicationSchema,
  pncCourtCaseSchema,
  pncDisposalSchema,
  pncOffenceSchema,
  pncPenaltyCaseSchema
} from "@moj-bichard7/core/phase1/schemas/pncQueryResult"
import { pncQueryResultSchema } from "@moj-bichard7/core/phase1/schemas/pncQueryResult"
import type { z } from "zod"

export type PncOffence = z.infer<typeof pncOffenceSchema>
export type PncQueryResult = z.infer<typeof pncQueryResultSchema>
export type PncCourtCase = z.infer<typeof pncCourtCaseSchema>
export type PncPenaltyCase = z.infer<typeof pncPenaltyCaseSchema>
export type PncDisposal = z.infer<typeof pncDisposalSchema>
export type PncAdjudication = z.infer<typeof pncAdjudicationSchema>

export { pncQueryResultSchema }
