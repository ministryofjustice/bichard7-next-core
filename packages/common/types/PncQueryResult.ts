import type { z } from "zod"

import type {
  pncAdjudicationSchema,
  pncCourtCaseSchema,
  pncDisposalSchema,
  pncOffenceSchema,
  pncPenaltyCaseSchema
} from "../schemas/pncQueryResult"

import { pncQueryResultSchema } from "../schemas/pncQueryResult"

export type PncAdjudication = z.infer<typeof pncAdjudicationSchema>
export type PncCourtCase = z.infer<typeof pncCourtCaseSchema>
export type PncDisposal = z.infer<typeof pncDisposalSchema>
export type PncOffence = z.infer<typeof pncOffenceSchema>
export type PncPenaltyCase = z.infer<typeof pncPenaltyCaseSchema>
export type PncQueryResult = z.infer<typeof pncQueryResultSchema>

export { pncQueryResultSchema }
