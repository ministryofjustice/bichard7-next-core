import type z from "zod"

import type errorResponseSchema from "../../schemas/leds/errorResponseSchema"

export type ErrorResponse = z.infer<typeof errorResponseSchema>
