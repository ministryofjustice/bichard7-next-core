import { z } from "zod"

const pncDisposalSchema = z.object({
  qtyDate: z.string().optional(),
  qtyDuration: z.string().optional(),
  qtyMonetaryValue: z.string().optional(),
  qtyUnitsFined: z.string().optional(),
  qualifiers: z.string().optional(),
  text: z.string().optional(),
  type: z.number()
})

const pncAdjudicationSchema = z.object({
  verdict: z.string(),
  sentenceDate: z.date(),
  offenceTICNumber: z.number(),
  plea: z.string(),
  weedFlag: z.string().optional()
})

const pncOffenceSchema = z.object({
  offence: z.object({
    acpoOffenceCode: z.string(),
    cjsOffenceCode: z.string(),
    startDate: z.date(),
    startTime: z.string().optional(),
    endDate: z.date().optional(),
    endTime: z.string().optional(),
    qualifier1: z.string().optional(),
    qualifier2: z.string().optional(),
    title: z.string().optional(),
    sequenceNumber: z.number()
  }),
  adjudication: pncAdjudicationSchema.optional(),
  disposals: z.array(pncDisposalSchema).optional()
})

const pncCourtCaseSchema = z.object({
  courtCaseReference: z.string(),
  crimeOffenceReference: z.string().optional(),
  offences: z.array(pncOffenceSchema)
})

const pncPenaltyCaseSchema = z.object({
  penaltyCaseReference: z.string(),
  offences: z.array(pncOffenceSchema)
})

const pncQueryResultSchema = z.object({
  forceStationCode: z.string(),
  croNumber: z.string().optional(),
  checkName: z.string(),
  pncId: z.string(),
  courtCases: z.array(pncCourtCaseSchema).optional(),
  penaltyCases: z.array(pncPenaltyCaseSchema).optional()
})

export type PncOffence = z.infer<typeof pncOffenceSchema>
export type PncQueryResult = z.infer<typeof pncQueryResultSchema>
export type PncCourtCase = z.infer<typeof pncCourtCaseSchema>
export type PncPenaltyCase = z.infer<typeof pncPenaltyCaseSchema>
export type PNCDisposal = z.infer<typeof pncDisposalSchema>
export type PncAdjudication = z.infer<typeof pncAdjudicationSchema>

export { pncQueryResultSchema }
