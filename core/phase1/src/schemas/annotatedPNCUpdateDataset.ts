import { z } from "zod"
import { hearingOutcomeSchema } from "./annotatedHearingOutcome"
import { exceptionSchema } from "./exception"
import { pncQueryResultSchema } from "./pncQueryResult"

export const annotatedPNCUpdateDatasetSchema = z.object({
  AnnotatedPNCUpdateDataset: z.object({
    PNCUpdateDataset: z.object({
      Exceptions: z.array(exceptionSchema),
      AnnotatedHearingOutcome: z.object({
        HearingOutcome: hearingOutcomeSchema
      }),
      PncQuery: pncQueryResultSchema.optional(),
      PncQueryDate: z.date().optional(),
      PncErrorMessage: z.string().optional()
    })
  })
})
