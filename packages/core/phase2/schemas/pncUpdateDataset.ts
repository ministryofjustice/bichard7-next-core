import { z } from "zod"
import {
  courtCaseReferenceNumberSchema,
  organisationUnitSchema,
  unvalidatedHearingOutcomeSchema
} from "../../schemas/unvalidatedHearingOutcome"
import { PNCMessageType } from "../types/operationCodes"

export const operationStatusSchema = z.union([z.literal("Completed"), z.literal("Failed"), z.literal("NotAttempted")])

export const newremOperationSchema = z.object({
  code: z.literal(PNCMessageType.REMAND),
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
  code: z.literal(PNCMessageType.NORMAL_DISPOSAL),
  data: z
    .object({
      courtCaseReference: courtCaseReferenceNumberSchema
    })
    .optional(),
  addedByTheCourt: z.boolean().optional(),
  status: operationStatusSchema
})

const sendefOperationSchema = z.object({
  code: z.literal(PNCMessageType.SENTENCE_DEFERRED),
  data: z
    .object({
      courtCaseReference: courtCaseReferenceNumberSchema
    })
    .optional(),
  status: operationStatusSchema
})

const subvarOperationSchema = z.object({
  code: z.literal(PNCMessageType.DISPOSAL_UPDATED),
  data: z
    .object({
      courtCaseReference: courtCaseReferenceNumberSchema
    })
    .optional(),
  status: operationStatusSchema
})

const penhrgOperationSchema = z.object({
  code: z.literal(PNCMessageType.PENALTY_HEARING),
  data: z
    .object({
      courtCaseReference: courtCaseReferenceNumberSchema
    })
    .optional(),
  status: operationStatusSchema
})

const comsenOperationSchema = z.object({
  code: z.literal(PNCMessageType.COMMITTED_SENTENCING),
  data: z
    .object({
      courtCaseReference: courtCaseReferenceNumberSchema
    })
    .optional(),
  status: operationStatusSchema
})

const apphrdOperationSchema = z.object({
  code: z.literal(PNCMessageType.APPEALS_UPDATE),
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
