import type { z } from "zod"

import type { ledsApiResultSchema } from "../schemas/ledsApiResult"

export type LedsApiResult = z.infer<typeof ledsApiResultSchema>
