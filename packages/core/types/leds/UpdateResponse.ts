import type z from "zod"

import type { updateResponseSchema } from "../../schemas/leds/updateResponse"

export type UpdateResponse = z.infer<typeof updateResponseSchema>
