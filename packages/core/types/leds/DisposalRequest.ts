import type z from "zod"

import type { defendantSchema } from "../../schemas/leds/addDisposalRequest"
import type { adjudicationSchema, courtSchema, pleaSchema } from "../../schemas/leds/common"

export type Adjudication = z.infer<typeof adjudicationSchema>
export type Court = z.infer<typeof courtSchema>
export type Defendant = z.infer<typeof defendantSchema>
export type Plea = z.infer<typeof pleaSchema>
