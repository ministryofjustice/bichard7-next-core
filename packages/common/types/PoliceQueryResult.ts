import type { z } from "zod"

import type {
  policeAdjudicationSchema,
  policeCourtCaseSchema,
  policeDisposalSchema,
  policeOffenceSchema,
  policePenaltyCaseSchema,
  policeQueryResultSchema
} from "../schemas/policeQueryResult"

export type PoliceAdjudication = z.infer<typeof policeAdjudicationSchema>
export type PoliceCourtCase = z.infer<typeof policeCourtCaseSchema>
export type PoliceDisposal = z.infer<typeof policeDisposalSchema>
export type PoliceOffence = z.infer<typeof policeOffenceSchema>
export type PolicePenaltyCase = z.infer<typeof policePenaltyCaseSchema>
export type PoliceQueryResult = z.infer<typeof policeQueryResultSchema>
