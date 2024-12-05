import type { z } from "zod"

import { unvalidatedHearingOutcomeSchema } from "../../../schemas/unvalidatedHearingOutcome"

const _partialAho = unvalidatedHearingOutcomeSchema.deepPartial()
export type PartialAho = z.infer<typeof _partialAho>
