import type { z } from "zod"

import { unvalidatedHearingOutcomeSchema } from "@moj-bichard7/common/schemas/unvalidatedHearingOutcome"

const _partialAho = unvalidatedHearingOutcomeSchema.deepPartial()
export type PartialAho = z.infer<typeof _partialAho>
