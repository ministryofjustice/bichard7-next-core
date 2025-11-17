import type { z } from "zod"

import type {
  asnQueryResponseSchema,
  disposalDurationSchema,
  disposalResultSchema,
  disposalSchema,
  offenceSchema
} from "../../schemas/leds/asnQueryResponse"

export type AsnQueryResponse = z.infer<typeof asnQueryResponseSchema>
export type Disposal = z.infer<typeof disposalSchema>
export type DisposalDuration = z.infer<typeof disposalDurationSchema>
export type DisposalResult = z.infer<typeof disposalResultSchema>
export type Offence = z.infer<typeof offenceSchema>
