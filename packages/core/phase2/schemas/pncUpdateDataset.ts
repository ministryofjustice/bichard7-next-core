import { z } from "zod"
import {
  annotatedHearingOutcomeSchema,
  courtCaseReferenceNumberSchema,
  organisationUnitSchema
} from "../../phase1/schemas/annotatedHearingOutcome"

export const operationStatusSchema = z.union([z.literal("Completed"), z.literal("Failed"), z.literal("NotAttempted")])

const newremOperationSchema = z.object({
  code: z.literal("NEWREM"),
  data: z.object({
    nextHearingDate: z.date(),
    nextHearingLocation: organisationUnitSchema
  }).optional(),
  status: operationStatusSchema
})

const disarrOperationSchema = z.object({
  code: z.literal("DISARR"),
  data: z.object({
    courtCaseReference: courtCaseReferenceNumberSchema
  }).optional(),
  status: operationStatusSchema
})

const sendefOperationSchema = z.object({
  code: z.literal("SENDEF"),
  data: z.object({
    courtCaseReference: courtCaseReferenceNumberSchema
  }).optional(),
  status: operationStatusSchema
})

export const operationSchema = z.discriminatedUnion("code", [
  newremOperationSchema,
  disarrOperationSchema,
  sendefOperationSchema
])

const pncUpdateDatasetSchema = annotatedHearingOutcomeSchema.extend({
  PncOperations: operationSchema.array().min(0)
})

export default pncUpdateDatasetSchema
