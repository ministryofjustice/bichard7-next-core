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
  acpoOffenceCode: z.preprocess(stringOrUndefined, z.string().optional()),
  cjsOffenceCode: z.string(),
  disposals: z.array(pncApiDisposalSchema),
  endDate: z.preprocess(dateOrUndefined, z.date().optional()),
  endTime: z.preprocess(stringOrUndefined, z.string().optional()),
  hearingDate: z.preprocess(dateOrUndefined, z.date().optional()),
  numberOffencesTakenIntoAccount: z.preprocess(numberOrUndefined, z.number().optional()),
  offenceQualifier1: z.preprocess(stringOrUndefined, z.string().optional()),
  offenceQualifier2: z.preprocess(stringOrUndefined, z.string().optional()),
  pleaStatus: z.preprocess(stringOrUndefined, z.string().optional()),
  referenceNumber: z.string(),
  sentenceDate: z.preprocess(dateOrUndefined, z.date().optional()),
  startDate: z.date(),
  startTime: z.preprocess(stringOrUndefined, z.string().optional()),
  title: z.preprocess(stringOrUndefined, z.string().optional()),
  verdict: z.preprocess(stringOrUndefined, z.string().optional())
})

export const pncApiCourtCaseSchema = z.object({
  courtCaseRefNo: z.string(),
  crimeOffenceRefNo: z.preprocess(stringOrUndefined, z.string().optional()),
  offences: z.array(pncApiOffenceSchema)
})

export const pncApiPenaltyCaseSchema = z.object({
  crimeOffenceRefNo: z.preprocess(stringOrUndefined, z.string().optional()),
  offences: z.array(pncApiOffenceSchema),
  penaltyCaseRefNo: z.string()
})

export const pncApiResultSchema = z.object({
  courtCases: z.array(pncApiCourtCaseSchema),
  croNumber: z.preprocess(stringOrUndefined, z.string().optional()),
  forceStationCode: z.string(),
  penaltyCases: z.array(pncApiPenaltyCaseSchema),
  pncCheckName: z.string(),
  pncIdentifier: z.string()
})
