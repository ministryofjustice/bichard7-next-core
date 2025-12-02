import type z from "zod"

import type {
  reasonForAppearanceSchema,
  subsequentDisposalResultsRequestSchema
} from "../../schemas/leds/subsequentDisposalResultsRequest"

export type ReasonForAppearance = z.infer<typeof reasonForAppearanceSchema>
export type SubsequentDisposalResultsRequest = z.infer<typeof subsequentDisposalResultsRequestSchema>
