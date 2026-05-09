import { z } from "zod"

import {
  adjudicationSchema,
  disposalResultSchema as baseDisposalResultSchema,
  baseOffenceSchema,
  courtSchema,
  dateStringSchema
} from "./common"

export const offenceTimeStringSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
  .describe(
    "The Time in UTC. Used for showing Time field in format 23:59. Entry must be a valid 5 character time format."
  )

export const adjudicationDetailsSchema = z.object({
  adjudicationId: z.string(),
  appearanceNumber: z.number(),
  disposalDate: dateStringSchema,
  adjudication: adjudicationSchema
})

export const disposalDurationSchema = z.object({
  units: z.string(),
  count: z.number()
})

export const disposalResultSchema = baseDisposalResultSchema.extend({
  disposalId: z.string(),
  chargeAppearanceNumber: z.number().optional()
})

export const offenceSchema = baseOffenceSchema.extend({
  adjudications: adjudicationDetailsSchema.array().optional(),
  offenceId: z.string(),
  offenceDescription: z.array(z.string().min(1).max(54)).min(1).max(2).optional(),
  offenceStartDate: dateStringSchema,
  offenceStartTime: offenceTimeStringSchema.optional(),
  offenceEndTime: offenceTimeStringSchema.optional(),
  disposalResults: disposalResultSchema.array().optional(),
  cjsOffenceCode: z.string().min(1).max(8)
})

export const disposalSchema = z.object({
  courtCaseId: z.string(),
  courtCaseReference: z.string(),
  caseStatusMarker: z.string(),
  oldCourtCaseReference: z.string().optional(),
  userReference: z.string().optional(),
  convictionDate: dateStringSchema.optional(),
  otherTicTotal: z.number().optional(),
  court: courtSchema,
  offences: z.array(offenceSchema)
})

export const asnQueryResponseSchema = z.object({
  personId: z.string(),
  personUrn: z.string(),
  reportId: z.string(),
  asn: z.string(),
  ownerCode: z.string(),
  disposals: z.array(disposalSchema)
})
