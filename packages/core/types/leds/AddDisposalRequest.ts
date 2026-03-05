import type z from "zod"

import type {
  addDisposalRequestSchema,
  arrestOffenceSchema,
  carryForwardSchema
} from "../../schemas/leds/addDisposalRequest"

export type AddDisposalRequest = z.infer<typeof addDisposalRequestSchema>
export type ArrestOffence = z.infer<typeof arrestOffenceSchema>
export type CarryForward = z.infer<typeof carryForwardSchema>
export type DisposalResult = NonNullable<Offence["disposalResults"]>[number]
export type Offence = NonNullable<AddDisposalRequest["offences"]>[number]
