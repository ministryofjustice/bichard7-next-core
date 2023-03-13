import { z } from "zod"

const dateOrUndefined = (input: unknown): Date | undefined => {
  if (input instanceof Date) {
    return input
  }
}

const stringOrUndefined = (input: unknown): string | undefined => {
  if (typeof input === "string" && input !== "") {
    return input
  }
}

const numberOrUndefined = (input: unknown): number | undefined => {
  if (typeof input === "number") {
    return input
  }
  if (typeof input === "string" && /^\d+$/.test(input)) {
    return Number(input)
  }
}

export const pncApiDisposalSchema = z.object({
  disposalQualifiers: z.preprocess(stringOrUndefined, z.string().optional()),
  disposalQuantityDate: z.preprocess(stringOrUndefined, z.string().optional()),
  disposalQuantityDuration: z.preprocess(stringOrUndefined, z.string().optional()),
  disposalQuantityMonetaryValue: z.preprocess(stringOrUndefined, z.string().optional()),
  disposalText: z.preprocess(stringOrUndefined, z.string().optional()),
  disposalType: z.preprocess(stringOrUndefined, z.string().optional())
})

export const pncApiOffenceSchema = z.object({
  pleaStatus: z.preprocess(stringOrUndefined, z.string().optional()),
  verdict: z.preprocess(stringOrUndefined, z.string().optional()),
  hearingDate: z.preprocess(dateOrUndefined, z.date().optional()),
  sentenceDate: z.preprocess(dateOrUndefined, z.date().optional()),
  numberOffencesTakenIntoAccount: z.preprocess(numberOrUndefined, z.number().optional()),
  offenceQualifier1: z.preprocess(stringOrUndefined, z.string().optional()),
  offenceQualifier2: z.preprocess(stringOrUndefined, z.string().optional()),
  acpoOffenceCode: z.preprocess(stringOrUndefined, z.string().optional()),
  title: z.preprocess(stringOrUndefined, z.string().optional()),
  referenceNumber: z.string(),
  cjsOffenceCode: z.string(),
  startDate: z.date(),
  startTime: z.preprocess(stringOrUndefined, z.string().optional()),
  endDate: z.preprocess(dateOrUndefined, z.date().optional()),
  endTime: z.preprocess(stringOrUndefined, z.string().optional()),
  disposals: z.array(pncApiDisposalSchema)
})

export const pncApiCourtCaseSchema = z.object({
  courtCaseRefNo: z.string(),
  crimeOffenceRefNo: z.preprocess(stringOrUndefined, z.string().optional()),
  offences: z.array(pncApiOffenceSchema)
})

export const pncApiPenaltyCaseSchema = z.object({
  penaltyCaseRefNo: z.string(),
  crimeOffenceRefNo: z.string(),
  offences: z.array(pncApiOffenceSchema)
})

export const pncApiResultSchema = z.object({
  forceStationCode: z.string(),
  pncIdentifier: z.string(),
  pncCheckName: z.string(),
  croNumber: z.preprocess(stringOrUndefined, z.string().optional()),
  courtCases: z.array(pncApiCourtCaseSchema),
  penaltyCases: z.array(pncApiPenaltyCaseSchema)
})
