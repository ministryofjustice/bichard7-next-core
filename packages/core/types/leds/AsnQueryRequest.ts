import type z from "zod"

import type { asnQueryRequestSchema } from "../../schemas/leds/asnQueryRequest"

export type AsnQueryRequest = z.infer<typeof asnQueryRequestSchema>
