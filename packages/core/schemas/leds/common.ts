import z from "zod"

export const dateStringSchema = z.string().regex(/\d{4}-\d{2}-\d{2}/)

export const timeStringSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(Z|[+-][01]\d:[0-5]\d)$/)

export const checkNameSchema = z.string().min(1).max(54)

export const forceStationCodeSchema = z
  .string()
  .regex(/^[0-9A-Za-z]*$/)
  .length(4)

export const courtSchema = z.discriminatedUnion("courtIdentityType", [
  z.object({
    courtIdentityType: z.literal("code"),
    courtCode: z.string()
  }),
  z.object({
    courtIdentityType: z.literal("text"),
    courtName: z.string()
  })
])

export const courtCaseReferenceSchema = z
  .string()
  .regex(/^(\d{2}\/[\d]{4}\/\d{1,6}[A-Za-z])$/)
  .min(1)
  .max(15)

export const pleaSchema = z.enum(["Not Known", "Guilty", "Not Guilty", "No Plea Taken", "Consented", "Resisted"])

export const adjudicationSchema = z.enum(["Guilty", "Not Guilty", "Non-Conviction", ""])

const disposalDurationSchema = z.object({
  units: z.enum(["life", "years", "months", "weeks", "days", "hours"]),
  count: z.number()
})

export const disposalResultSchema = z.object({
  disposalCode: z.string(),
  disposalDuration: disposalDurationSchema.optional(),
  disposalFine: z
    .object({
      amount: z.number(),
      units: z.number().optional()
    })
    .optional(),
  disposalEffectiveDate: dateStringSchema.optional(),
  disposalQualifies: z.array(z.string()).max(4).optional(),
  disposalQualifierDuration: disposalDurationSchema.optional(),
  disposalText: z.string().optional()
})

export const baseOffenceSchema = z.object({
  courtOffenceSequenceNumber: z.string(),
  npccOffenceCode: z
    .string()
    .regex(/^([0-9]{1,3}\.){1,2}[0-9]{1,3}(\.[0-9]{1,3})?$/)
    .optional(),
  cjsOffenceCode: z.string().length(7).optional(),
  roleQualifiers: z.array(z.string().regex(/[A-Za-z]*/)).optional(),
  legislationQualifiers: z.array(z.string().regex(/[A-Za-z]*/)).optional(),
  plea: pleaSchema.optional(),
  adjudication: adjudicationSchema.optional(),
  dateOfSentence: dateStringSchema.optional(),
  offenceTic: z.number().optional(),
  offenceStartTime: timeStringSchema.optional(),
  offenceEndDate: dateStringSchema.optional(),
  offenceEndTime: timeStringSchema.optional(),
  disposalResults: z.array(disposalResultSchema).optional()
})

export const offenceSchema = baseOffenceSchema.extend(
  z.object({
    offenceStartDate: dateStringSchema.optional(),
    offenceId: z.string()
  })
)
