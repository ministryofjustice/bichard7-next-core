import { addDisposalRequestSchema } from "@moj-bichard7/core/schemas/leds/addDisposalRequest"
import { z } from "zod"

export const MockAddDisposalRequestSchema = addDisposalRequestSchema.extend({
  pncCheckName: z.string(),
  croNumber: z.string(),
  crimeOffenceReferenceNumber: z.string()
})

export type MockAddDisposalRequest = z.infer<typeof MockAddDisposalRequestSchema>
