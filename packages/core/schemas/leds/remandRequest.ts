import z from "zod"

import { courtSchema, dateStringSchema, forceStationCodeSchema } from "./common"

export const appearanceResultSchema = z.enum([
  "remanded-on-bail",
  "remanded-in-custody",
  "adjourned",
  "remanded-in-care",
  "remanded-on-police-bail",
  "postal-requisition",
  "released-under-investigation"
])

export const nextAppearanceSchema = z.object({
  date: dateStringSchema.optional(),
  forceStationCode: forceStationCodeSchema.optional(),
  court: courtSchema.optional()
})

export const currentAppearanceSchema = z.object({
  forceStationCode: forceStationCodeSchema.optional(),
  court: courtSchema.optional()
})

const telephoneNumberSchema = z.object({
  telephoneNumber: z.string().optional(),
  telephoneCode: z.string().optional(),
  telephoneTown: z.string().optional(),
  telephoneExtension: z.string().optional()
})

const socialWorkerSchema = z.object({
  name: z
    .string()
    .regex(/^(?=.*[A-Za-z0-9,():'&\-])[A-Za-z0-9,():'&\-. /]+$/)
    .max(54)
    .optional(),
  telephoneNumber: telephoneNumberSchema.optional()
})

const localAuthoritySchema = z.object({
  localAuthorityIdentityType: z.string(),
  localAuthoritySecureUnit: z.boolean().optional(),
  socialWorker: socialWorkerSchema.optional()
})

export const remandRequestSchema = z.object({
  // TEMP: Remove before PR approval
  pncCheckName: z.string(),
  croNumber: z.string(),
  arrestSummonsNumber: z.string(),
  crimeOffenceReferenceNo: z.string(),
  remandResult: z.string(),
  remandLocationFfss: z.string(),
  // TEMP: Remove before PR approval
  ownerCode: forceStationCodeSchema,
  personUrn: z.string().nonempty(),
  remandDate: dateStringSchema,
  appearanceResult: appearanceResultSchema,
  currentAppearance: currentAppearanceSchema.optional(),
  nextAppearance: nextAppearanceSchema.optional(),
  localAuthority: localAuthoritySchema.optional(),
  bailConditions: z
    .array(z.string().min(1).max(203))
    .describe(
      String.raw`An individual Condition set against the Remand. Each Condition is described by text up to 200 characters. However, text really consists of 4 lines of at most 50 characters, each line separated by '\n'. Note that an additional 3 characters are allowed by the below validation to allow for the newline characters. The first line must contain some text before a '\n' character can be used.`
    )
})
