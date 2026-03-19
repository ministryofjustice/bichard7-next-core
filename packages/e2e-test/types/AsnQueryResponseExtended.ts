import { asnQueryResponseSchema, disposalSchema, offenceSchema } from "@moj-bichard7/core/schemas/leds/asnQueryResponse"
import { z } from "zod"

const offenceExtendedSchema = offenceSchema.extend({
  acpoOffenceCode: z.string().optional()
})

const disposalExtendedSchema = disposalSchema.extend({
  crimeOffenceReferenceNumber: z.string().optional(),
  offences: z.array(offenceExtendedSchema)
})

export const asnQueryResponseExtendedSchema = asnQueryResponseSchema.extend({
  updateType: z.string().optional(),
  pncCheckName: z.string().optional(),
  croNumber: z.string().optional(),
  disposals: z.array(disposalExtendedSchema)
})

export type OffenceExtended = z.infer<typeof offenceExtendedSchema>
export type DisposalExtended = z.infer<typeof disposalExtendedSchema>
export type AsnQueryResponseExtended = z.infer<typeof asnQueryResponseExtendedSchema>
