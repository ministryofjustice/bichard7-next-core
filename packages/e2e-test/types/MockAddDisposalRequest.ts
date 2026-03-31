import {
  addDisposalRequestSchema,
  additionalArrestOffencesSchema,
  arrestOffenceSchema
} from "@moj-bichard7/core/schemas/leds/addDisposalRequest"
import { z } from "zod"

const MockArrestOffenceSchema = arrestOffenceSchema.extend({
  crimeOffenceReferenceNumber: z.string()
})

const MockAdditionalArrestOffencesSchema = additionalArrestOffencesSchema.extend({
  additionalOffences: z.array(MockArrestOffenceSchema)
})

export const MockAddDisposalRequestSchema = addDisposalRequestSchema.extend({
  pncCheckName: z.string(),
  croNumber: z.string(),
  additionalArrestOffences: MockAdditionalArrestOffencesSchema.array().optional()
})

export type MockAddDisposalRequest = z.infer<typeof MockAddDisposalRequestSchema>
