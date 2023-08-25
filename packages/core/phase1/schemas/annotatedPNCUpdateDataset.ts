import { z } from "zod"
import { hearingOutcomeSchema } from "../schemas/annotatedHearingOutcome"
import { exceptionSchema } from "../schemas/exception"
import { pncQueryResultSchema } from "../schemas/pncQueryResult"

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
