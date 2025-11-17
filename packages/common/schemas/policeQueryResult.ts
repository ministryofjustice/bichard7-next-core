import { z } from "zod"

import { ahoDescription } from "./schemaDescription"

export const policeDisposalSchema = z.object({
  disposalId: z.string().optional(),
  qtyDate: z.string().optional(),
  qtyDuration: z.string().optional(),
  qtyMonetaryValue: z.string().optional(),
  qtyUnitsFined: z.string().optional(),
  qualifiers: z.string().optional(),
  text: z.string().optional(),
  type: z.number().optional()
})

export const policeAdjudicationSchema = z.object({
  offenceTICNumber: z.number(),
  plea: z.string(),
  sentenceDate: z.coerce.date().optional(),
  verdict: z.string(),
  weedFlag: z.string().optional()
})

export const policeOffenceSchema = z.object({
  adjudication: policeAdjudicationSchema.optional(),
  disposals: z.array(policeDisposalSchema).optional(),
  offence: z.object({
    offenceId: z.string().optional(),
    acpoOffenceCode: z.string().optional(),
    cjsOffenceCode: z.string(),
    endDate: z.coerce.date().optional(),
    endTime: z.string().optional(),
    qualifier1: z.string().optional(),
    qualifier2: z.string().optional(),
    sequenceNumber: z.number(),
    startDate: z.coerce.date(),
    startTime: z.string().optional(),
    title: z.string().optional()
  })
})

export const policeCourtCaseSchema = z.object({
  courtCaseId: z.string().optional(),
  courtCaseReference: z.string(),
  crimeOffenceReference: z.string().optional(),
  offences: z.array(policeOffenceSchema)
})

export const policePenaltyCaseSchema = z.object({
  offences: z.array(policeOffenceSchema),
  penaltyCaseReference: z.string()
})

export const policeQueryResultSchema = z.object({
  checkName: z.string(),
  courtCases: z.array(policeCourtCaseSchema).optional(),
  croNumber: z.string().optional(),
  forceStationCode: z.string().describe(ahoDescription.AnnotatedHearingOutcome.PncQuery.forceStationCode.$description),
  penaltyCases: z.array(policePenaltyCaseSchema).optional(),
  pncId: z.string(),
  personId: z.string().optional(),
  reportId: z.string().optional()
})
