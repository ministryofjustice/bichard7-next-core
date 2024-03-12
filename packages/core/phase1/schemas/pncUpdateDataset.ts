import { z } from "zod"
import {
  annotatedHearingOutcomeSchema,
  courtCaseReferenceNumberSchema,
  organisationUnitSchema
} from "../schemas/annotatedHearingOutcome"

const pncUpdateDatasetSchema = z.object({
  AnnotatedHearingOutcome: annotatedHearingOutcomeSchema,
  Operation: z
    .object({
      operationCode: z.discriminatedUnion("__type", [
        z.object({
          __type: z.literal("NEWREM"),
          NEWREM: z.object({
            nextHearingDate: z.date(),
            nextHearingLocation: organisationUnitSchema
          })
        }),
        z.object({
          __type: z.literal("SENDEF"),
          SENDEF: z.object({
            courtCaseReference: courtCaseReferenceNumberSchema
          })
        }),
        z.object({
          __type: z.literal("DISARR"),
          DISARR: z.object({
            courtCaseReference: courtCaseReferenceNumberSchema
          })
        })
      ]),
      operationStatus: z.union([z.literal("Completed"), z.literal("Failed"), z.literal("NotAttempted")])
    })
    .array()
    .min(0)
})

export default pncUpdateDatasetSchema
