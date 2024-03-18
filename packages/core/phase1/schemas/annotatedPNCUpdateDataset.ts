import { z } from "zod"
import { exceptionSchema } from "../schemas/exception"
import { pncQueryResultSchema } from "../schemas/pncQueryResult"
import { hearingOutcomeSchema } from "../schemas/unvalidatedHearingOutcome"

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
