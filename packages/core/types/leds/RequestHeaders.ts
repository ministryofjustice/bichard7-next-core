import type z from "zod"

import type { requestHeadersSchema } from "../../schemas/leds/requestHeaders"

export type RequestHeaders = z.infer<typeof requestHeadersSchema>
