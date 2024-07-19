import type { z } from "zod"
import { unvalidatedHearingOutcomeSchema } from "../../../schemas/unvalidatedHearingOutcome"

const partialAho = unvalidatedHearingOutcomeSchema.deepPartial()
export type PartialAho = z.infer<typeof partialAho>
