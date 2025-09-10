import type z from "zod"

import type { remandRequestSchema } from "../../schemas/leds/remandRequest"

export type RemandRequest = z.infer<typeof remandRequestSchema>
