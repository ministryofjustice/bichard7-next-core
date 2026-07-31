import z from "zod"

import pncUpdateDatasetSchema from "../schemas/pncUpdateDataset"
import { unvalidatedHearingOutcomeSchema } from "../schemas/unvalidatedHearingOutcome"

export const annotatedHearingOutcomeOrPncUpdateDatasetSchema = z.union([
  pncUpdateDatasetSchema,
  unvalidatedHearingOutcomeSchema
])

export type AnnotatedHearingOutcomeOrPncUpdateDataset = z.infer<typeof annotatedHearingOutcomeOrPncUpdateDatasetSchema>
