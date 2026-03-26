import { remandRequestSchema } from "@moj-bichard7/core/schemas/leds/remandRequest"
import { z } from "zod"

export const MockRemandRequestSchema = remandRequestSchema.extend({
  pncCheckName: z.string(),
  croNumber: z.string(),
  arrestSummonsNumber: z.string(),
  crimeOffenceReferenceNo: z.string(),
  remandResult: z.string(),
  remandLocationFfss: z.string()
})

export type MockRemandRequest = z.infer<typeof MockRemandRequestSchema>
