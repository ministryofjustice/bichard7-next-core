import type {
  pncAdjudicationSchema,
  pncCourtCaseSchema,
  pncDisposalSchema,
  pncOffenceSchema,
  pncPenaltyCaseSchema
} from "@moj-bichard7/common/schemas/pncQueryResult"
import type { z } from "zod"

import { pncQueryResultSchema } from "@moj-bichard7/common/schemas/pncQueryResult"

export type PncAdjudication = z.infer<typeof pncAdjudicationSchema>
export type PncCourtCase = z.infer<typeof pncCourtCaseSchema>
export type PncDisposal = z.infer<typeof pncDisposalSchema>
export type PncOffence = z.infer<typeof pncOffenceSchema>
export type PncPenaltyCase = z.infer<typeof pncPenaltyCaseSchema>
export type PncQueryResult = z.infer<typeof pncQueryResultSchema>

export { pncQueryResultSchema }
