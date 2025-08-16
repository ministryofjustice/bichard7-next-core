import { z } from "zod"

import { ahoDescription } from "./schemaDescription"

export const pncDisposalSchema = z.object({
  qtyDate: z.string().optional(),
  qtyDuration: z.string().optional(),
  qtyMonetaryValue: z.string().optional(),
  qtyUnitsFined: z.string().optional(),
  qualifiers: z.string().optional(),
  text: z.string().optional(),
  type: z.number().optional()
})

export const pncAdjudicationSchema = z.object({
  offenceTICNumber: z.number(),
  plea: z.string(),
  sentenceDate: z.coerce.date().optional(),
  verdict: z.string(),
  weedFlag: z.string().optional()
})

export const pncOffenceSchema = z.object({
  adjudication: pncAdjudicationSchema.optional(),
  disposals: z.array(pncDisposalSchema).optional(),
  offence: z.object({
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

export const pncCourtCaseSchema = z.object({
  courtCaseReference: z.string(),
  crimeOffenceReference: z.string().optional(),
  offences: z.array(pncOffenceSchema)
})

export const pncPenaltyCaseSchema = z.object({
  offences: z.array(pncOffenceSchema),
  penaltyCaseReference: z.string()
})

export const pncQueryResultSchema = z.object({
  checkName: z.string(),
  courtCases: z.array(pncCourtCaseSchema).optional(),
  croNumber: z.string().optional(),
  forceStationCode: z.string().describe(ahoDescription.AnnotatedHearingOutcome.PncQuery.forceStationCode.$description),
  penaltyCases: z.array(pncPenaltyCaseSchema).optional(),
  pncId: z.string()
})
