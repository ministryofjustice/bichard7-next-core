import z from "zod"

export const dateStringSchema = z.string().regex(/\d{4}-\d{2}-\d{2}/)

export const updateOffenceTimeStringSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(Z|[+-][01]\d:[0-5]\d)$/)
  .describe(String.raw`
  The time of day in ISO 8601 format with required timezone offset. Local time (without offset) is not allowed. Valid formats include:
  '14:30Z' (UTC)
  '14:30+02:00' (UTC+2)
  '14:30-05:30' (UTC-5:30)`)

export const forceStationCodeSchema = z
  .string()
  .regex(/^[0-9A-Za-z]*$/)
  .length(4)

export const courtSchema = z.discriminatedUnion("courtIdentityType", [
  z.object({
    courtIdentityType: z.literal("code"),
    courtCode: z
      .string()
      .max(4)
      .regex(/^[0-9]{4}$/)
  }),
  z.object({
    courtIdentityType: z.literal("name"),
    courtName: z.string().min(1).max(71)
  })
])

export const courtCaseReferenceSchema = z
  .string()
  .regex(/^(\d{2}\/[\d]{4}\/\d{1,6}[A-Za-z])$/)
  .min(1)
  .max(15)

export const pleaSchema = z.enum(["Not Known", "Guilty", "Not Guilty", "No Plea Taken", "Consented", "Resisted"])

export const adjudicationSchema = z.enum(["Guilty", "Not Guilty", "Non-Conviction", ""])

export const disposalDurationUnitSchema = z.enum(["life", "years", "months", "weeks", "days", "hours"])

export const disposalDurationSchema = z.object({
  units: disposalDurationUnitSchema,
  count: z.number()
})

export const disposalFineSchema = z.object({
  amount: z.number().optional(),
  units: z.number().optional()
})

export const disposalResultSchema = z.object({
  disposalCode: z.number().max(9999),
  disposalDuration: disposalDurationSchema.optional(),
  disposalFine: disposalFineSchema.optional(),
  disposalEffectiveDate: dateStringSchema.optional(),
  disposalQualifiers: z.array(z.string().min(1).max(2)).max(4).optional(),
  disposalQualifierDuration: disposalDurationSchema.optional(),
  disposalText: z.string().max(64).optional()
})

export const baseOffenceSchema = z.object({
  courtOffenceSequenceNumber: z.number(),
  npccOffenceCode: z
    .string()
    .regex(/^([0-9]{1,3}\.){1,2}[0-9]{1,3}(\.[0-9]{1,3})?$/)
    .optional(),
  roleQualifiers: z.array(z.string().regex(/[A-Za-z]*/)).optional(),
  legislationQualifiers: z.array(z.string().regex(/[A-Za-z]*/)).optional(),
  plea: pleaSchema.optional(),
  offenceTic: z.number().optional(),
  offenceEndDate: dateStringSchema.optional(),
  disposalResults: disposalResultSchema.array().optional()
})

export const updateOffenceSchema = baseOffenceSchema.extend({
  adjudication: adjudicationSchema.optional(),
  offenceStartDate: dateStringSchema.optional(),
  offenceId: z.string().nonempty(),
  dateOfSentence: dateStringSchema.optional(),
  cjsOffenceCode: z.string().length(7),
  offenceStartTime: updateOffenceTimeStringSchema.optional(),
  offenceEndTime: updateOffenceTimeStringSchema.optional()
})
