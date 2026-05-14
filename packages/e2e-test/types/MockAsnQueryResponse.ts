import { asnQueryResponseSchema, disposalSchema, offenceSchema } from "@moj-bichard7/core/schemas/leds/asnQueryResponse"
import { z } from "zod"

const mockOffenceSchema = offenceSchema.extend({
  acpoOffenceCode: z.string()
})

const mockDisposalSchema = disposalSchema.extend({
  crimeOffenceReferenceNumber: z.string(),
  penaltyCaseRefNo: z.string().optional(),
  offences: z.array(mockOffenceSchema)
})

export const mockAsnQueryResponseSchema = asnQueryResponseSchema.extend({
  pncCheckName: z.string(),
  croNumber: z.string(),
  disposals: z.array(mockDisposalSchema),
  gmh: z.string(),
  gmt: z.string()
})

export type MockOffence = z.infer<typeof mockOffenceSchema>
export type MockDisposal = z.infer<typeof mockDisposalSchema>
export type MockAsnQueryResponse = z.infer<typeof mockAsnQueryResponseSchema>
