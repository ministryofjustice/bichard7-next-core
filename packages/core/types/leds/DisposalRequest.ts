import type z from "zod"

import type { additionalArrestOffencesSchema, defendantSchema } from "../../schemas/leds/addDisposalRequest"
import type {
  adjudicationSchema,
  courtSchema,
  dateStringSchema,
  disposalDurationSchema,
  disposalDurationUnitSchema,
  disposalFineSchema,
  pleaSchema,
  updateOffenceSchema
} from "../../schemas/leds/common"

export type AdditionalArrestOffences = z.infer<typeof additionalArrestOffencesSchema>
export type Adjudication = z.infer<typeof adjudicationSchema>
export type Court = z.infer<typeof courtSchema>
export type DateString = z.infer<typeof dateStringSchema>
export type Defendant = z.infer<typeof defendantSchema>
export type DisposalDuration = z.infer<typeof disposalDurationSchema>
export type DisposalDurationUnit = z.infer<typeof disposalDurationUnitSchema>
export type DisposalFine = z.infer<typeof disposalFineSchema>
export type Offence = z.infer<typeof updateOffenceSchema>
export type Plea = z.infer<typeof pleaSchema>
