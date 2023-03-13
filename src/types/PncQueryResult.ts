import type { z } from "zod"
import type {
  pncAdjudicationSchema,
  pncCourtCaseSchema,
  pncDisposalSchema,
  pncOffenceSchema,
  pncPenaltyCaseSchema
} from "../../src/schemas/pncQueryResult"
import { pncQueryResultSchema } from "../../src/schemas/pncQueryResult"

export type PncOffence = z.infer<typeof pncOffenceSchema>
export type PncQueryResult = z.infer<typeof pncQueryResultSchema>
export type PncCourtCase = z.infer<typeof pncCourtCaseSchema>
export type PncPenaltyCase = z.infer<typeof pncPenaltyCaseSchema>
export type PncDisposal = z.infer<typeof pncDisposalSchema>
export type PncAdjudication = z.infer<typeof pncAdjudicationSchema>

export { pncQueryResultSchema }
