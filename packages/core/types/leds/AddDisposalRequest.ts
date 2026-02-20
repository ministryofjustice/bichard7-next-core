import type z from "zod"

import type { addDisposalRequestSchema, arrestOffenceSchema } from "../../schemas/leds/addDisposalRequest"

export type AddDisposalRequest = z.infer<typeof addDisposalRequestSchema>
export type ArrestOffence = z.infer<typeof arrestOffenceSchema>
