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
  verdict: z.string(),
  sentenceDate: z.coerce.date().optional(),
  offenceTICNumber: z.number(),
  plea: z.string(),
  weedFlag: z.string().optional()
})

export const pncOffenceSchema = z.object({
  offence: z.object({
    acpoOffenceCode: z.string().optional(),
    cjsOffenceCode: z.string(),
    startDate: z.coerce.date(),
    startTime: z.string().optional(),
    endDate: z.coerce.date().optional(),
    endTime: z.string().optional(),
    qualifier1: z.string().optional(),
    qualifier2: z.string().optional(),
    title: z.string().optional(),
    sequenceNumber: z.number()
  }),
  adjudication: pncAdjudicationSchema.optional(),
  disposals: z.array(pncDisposalSchema).optional()
})

export const pncCourtCaseSchema = z.object({
  courtCaseReference: z.string(),
  crimeOffenceReference: z.string().optional(),
  offences: z.array(pncOffenceSchema)
})

export const pncPenaltyCaseSchema = z.object({
  penaltyCaseReference: z.string(),
  offences: z.array(pncOffenceSchema)
})

export const pncQueryResultSchema = z.object({
  forceStationCode: z.string().describe(ahoDescription.AnnotatedHearingOutcome.PncQuery.forceStationCode.$description),
  croNumber: z.string().optional(),
  checkName: z.string(),
  pncId: z.string(),
  courtCases: z.array(pncCourtCaseSchema).optional(),
  penaltyCases: z.array(pncPenaltyCaseSchema).optional()
})
