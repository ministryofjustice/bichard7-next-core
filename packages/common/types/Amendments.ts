import { z } from "zod"

export const OffenceFieldSchema = <T extends z.ZodTypeAny>(valueSchema: T) =>
  z.object({
    offenceIndex: z.number(),
    value: valueSchema.optional()
  })

export const ResultFieldSchema = <T extends z.ZodTypeAny>(valueSchema: T) =>
  OffenceFieldSchema(valueSchema).extend({
    resultIndex: z.number()
  })

export const ResultQualifierCodeSchema = z.object({
  offenceIndex: z.number(),
  resultIndex: z.number().optional(),
  resultQualifierIndex: z.number(),
  value: z.string().optional()
})

export const AmendmentsSchema = z.object({
  asn: z.string().optional(),
  courtCaseReference: z.array(OffenceFieldSchema(z.string())).optional(),
  courtOffenceSequenceNumber: z.array(OffenceFieldSchema(z.number())).optional(),
  courtPNCIdentifier: z.string().optional(),
  courtReference: z.string().optional(),
  forceOwner: z.string().optional(),
  nextHearingDate: z.array(ResultFieldSchema(z.string())).optional(),
  nextSourceOrganisation: z.array(ResultFieldSchema(z.string())).optional(),
  offenceCourtCaseReferenceNumber: z.array(OffenceFieldSchema(z.string())).optional(),
  offenceReasonSequence: z.array(OffenceFieldSchema(z.number())).optional(),
  resultQualifierCode: z.array(ResultQualifierCodeSchema).optional(),
  resultVariableText: z.array(ResultFieldSchema(z.string())).optional()
})

export enum ValidProperties {
  NextHearingDate = "NextHearingDate",
  NextResultSourceOrganisation = "NextResultSourceOrganisation",
  ResultVariableText = "ResultVariableText"
}

export const ValidPropertiesSchema = z.nativeEnum(ValidProperties)

export type Amender = <T extends AmendmentKeys>(amendmentKey: T) => (newValue: Unpacked<Amendments[T]>) => void
export type AmendmentKeys = keyof Amendments

export type Amendments = z.infer<typeof AmendmentsSchema>

export type OffenceField<T> = {
  offenceIndex: number
  value?: T
}

export type ResultField<T> = OffenceField<T> & {
  resultIndex: number
}

export type ResultQualifierCode = z.infer<typeof ResultQualifierCodeSchema>

type Unpacked<T> = T extends (infer U)[] ? U : T
