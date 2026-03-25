import { asnQueryResponseSchema, disposalSchema, offenceSchema } from "@moj-bichard7/core/schemas/leds/asnQueryResponse"
import { z } from "zod"

const MockOffenceSchema = offenceSchema.extend({
  acpoOffenceCode: z.string(),
  updateType: z.string()
})

const MockDisposalSchema = disposalSchema.extend({
  crimeOffenceReferenceNumber: z.string(),
  offences: z.array(MockOffenceSchema)
})

export const MockAsnQueryResponseSchema = asnQueryResponseSchema.extend({
  updateType: z.string(),
  pncCheckName: z.string(),
  croNumber: z.string(),
  disposals: z.array(MockDisposalSchema),
  gmh: z.string(),
  gmt: z.string()
})

export type MockOffence = z.infer<typeof MockOffenceSchema>
export type MockDisposal = z.infer<typeof MockDisposalSchema>
export type MockAsnQueryResponse = z.infer<typeof MockAsnQueryResponseSchema>
