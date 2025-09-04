import { z } from "zod"

import { adjudicationSchema, courtSchema, dateStringSchema, pleaSchema } from "./common"

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

export const disposalResultSchema = z.object({
  disposalId: z.string(),
  disposalCode: z.number(),
  disposalEffectiveDate: dateStringSchema.optional(),
  disposalDuration: disposalDurationSchema.optional()
})

export const offenceSchema = z.object({
  offenceId: z.string(),
  courtOffenceSequenceNumber: z.number(),
  cjsOffenceCode: z.string(),
  offenceStartDate: dateStringSchema,
  offenceEndDate: dateStringSchema.optional(),
  offenceDescription: z.array(z.string()),
  plea: pleaSchema,
  adjudications: z.array(adjudicationDetailsSchema),
  disposalResults: z.array(disposalResultSchema)
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
