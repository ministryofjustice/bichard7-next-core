import { z } from "zod"
import {
  courtCaseReferenceNumberSchema,
  organisationUnitSchema,
  unvalidatedHearingOutcomeSchema
} from "../../schemas/unvalidatedHearingOutcome"

export const operationStatusSchema = z.union([z.literal("Completed"), z.literal("Failed"), z.literal("NotAttempted")])

export const newremOperationSchema = z.object({
  code: z.literal("NEWREM"),
  data: z
    .object({
      nextHearingDate: z.coerce.date().optional(),
      nextHearingLocation: organisationUnitSchema
    })
    .optional(),
  courtCaseReference: courtCaseReferenceNumberSchema.optional(),
  isAdjournmentPreJudgement: z.boolean().optional(),
  status: operationStatusSchema
})

const disarrOperationSchema = z.object({
  code: z.literal("DISARR"),
  data: z
    .object({
      courtCaseReference: courtCaseReferenceNumberSchema
    })
    .optional(),
  addedByTheCourt: z.boolean().optional(),
  status: operationStatusSchema
})

const sendefOperationSchema = z.object({
  code: z.literal("SENDEF"),
  data: z
    .object({
      courtCaseReference: courtCaseReferenceNumberSchema
    })
    .optional(),
  status: operationStatusSchema
})

const subvarOperationSchema = z.object({
  code: z.literal("SUBVAR"),
  data: z
    .object({
      courtCaseReference: courtCaseReferenceNumberSchema
    })
    .optional(),
  status: operationStatusSchema
})

const penhrgOperationSchema = z.object({
  code: z.literal("PENHRG"),
  data: z
    .object({
      courtCaseReference: courtCaseReferenceNumberSchema
    })
    .optional(),
  status: operationStatusSchema
})

const comsenOperationSchema = z.object({
  code: z.literal("COMSEN"),
  data: z
    .object({
      courtCaseReference: courtCaseReferenceNumberSchema
    })
    .optional(),
  status: operationStatusSchema
})

const apphrdOperationSchema = z.object({
  code: z.literal("APPHRD"),
  data: z
    .object({
      courtCaseReference: courtCaseReferenceNumberSchema
    })
    .optional(),
  status: operationStatusSchema
})

export const operationSchema = z.discriminatedUnion("code", [
  newremOperationSchema,
  disarrOperationSchema,
  sendefOperationSchema,
  subvarOperationSchema,
  penhrgOperationSchema,
  comsenOperationSchema,
  apphrdOperationSchema
])

const pncUpdateDatasetSchema = unvalidatedHearingOutcomeSchema.extend({
  PncOperations: operationSchema.array().min(0)
})

export default pncUpdateDatasetSchema
