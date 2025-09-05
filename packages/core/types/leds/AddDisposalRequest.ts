import type z from "zod"

import type { addDisposalRequestSchema } from "../../schemas/leds/addDisposalRequest"

export type AddDisposalRequest = z.infer<typeof addDisposalRequestSchema>
