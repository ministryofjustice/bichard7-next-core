import { z } from "zod"
import { hearingOutcomeSchema } from "./annotatedHearingOutcome"

export const annotatedPNCUpdateDatasetSchema = z.object({
  AnnotatedPNCUpdateDataset: z.object({
    PNCUpdateDataset: z.object({
      AnnotatedHearingOutcome: z.object({
        HearingOutcome: hearingOutcomeSchema
      })
    })
  })
})
