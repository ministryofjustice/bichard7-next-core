import { pncQueryResultSchema } from "phase1/schemas/pncQueryResult"
import { z } from "zod"
import { hearingOutcomeSchema } from "phase1/schemas/annotatedHearingOutcome"
import { exceptionSchema } from "phase1/schemas/exception"

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
