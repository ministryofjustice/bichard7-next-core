import type z from "zod"

import type { defendantSchema } from "../../schemas/leds/addDisposalRequest"
import type {
  adjudicationSchema,
  courtSchema,
  dateStringSchema,
  disposalDurationSchema,
  disposalFineSchema,
  pleaSchema
} from "../../schemas/leds/common"

export type Adjudication = z.infer<typeof adjudicationSchema>
export type Court = z.infer<typeof courtSchema>
export type DateString = z.infer<typeof dateStringSchema>
export type Defendant = z.infer<typeof defendantSchema>
export type DisposalDuration = z.infer<typeof disposalDurationSchema>
export type DisposalFine = z.infer<typeof disposalFineSchema>
export type Plea = z.infer<typeof pleaSchema>
