import { subsequentDisposalResultsRequestSchema } from "@moj-bichard7/core/schemas/leds/subsequentDisposalResultsRequest"
import { z } from "zod"

export const mockSubsequentDisposalResultsRequestSchema = subsequentDisposalResultsRequestSchema.extend({
  pncCheckName: z.string(),
  croNumber: z.string(),
  crimeOffenceReferenceNumber: z.string()
})

export type MockSubsequentDisposalResultsRequest = z.infer<typeof mockSubsequentDisposalResultsRequestSchema>
