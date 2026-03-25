import { asnQueryResponseSchema, disposalSchema } from "@moj-bichard7/core/schemas/leds/asnQueryResponse"
import { z } from "zod"

const MockDisposalSchema = disposalSchema.extend({
  crimeOffenceReferenceNumber: z.string()
})

export const MockAsnQueryResponseSchema = asnQueryResponseSchema.extend({
  pncCheckName: z.string(),
  croNumber: z.string(),
  disposals: z.array(MockDisposalSchema),
  gmh: z.string(),
  gmt: z.string()
})

export type MockDisposal = z.infer<typeof MockDisposalSchema>
export type MockAsnQueryResponse = z.infer<typeof MockAsnQueryResponseSchema>
