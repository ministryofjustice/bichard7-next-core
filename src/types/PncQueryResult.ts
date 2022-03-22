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
  adjudication: z
    .object({
      verdict: z.string(),
      sentenceDate: z.string(),
      offenceTICNumber: z.number(),
      plea: z.string(),
      weedFlag: z.string().optional()
    })
    .optional(),
  disposals: z.array(pncDisposalSchema).optional()
})

const pncCaseSchema = z.object({
  courtCaseReference: z.string(),
  crimeOffenceReference: z.string().optional(),
  offences: z.array(pncOffenceSchema)
})

const pncQueryResultSchema = z.object({
  forceStationCode: z.string(),
  croNumber: z.string().optional(),
  checkName: z.string(),
  pncId: z.string(),
  cases: z.array(pncCaseSchema).optional()
})

export type PncOffence = z.infer<typeof pncOffenceSchema>
export type PncQueryResult = z.infer<typeof pncQueryResultSchema>

export { pncQueryResultSchema }
