import z from "zod"

import { checkNameSchema, courtSchema, dateStringSchema, forceStationCodeSchema } from "./common"

export const appearanceResultSchema = z.enum([
  "remanded-on-bail",
  "remanded-in-custody",
  "adjourned",
  "remanded-in-care",
  "remanded-on-police-bail",
  "postal-requisition",
  "released-under-investigation"
])

export const ledsNextAppearanceSchema = z.object({
  date: dateStringSchema.optional(),
  forceStationCode: forceStationCodeSchema.optional(),
  court: courtSchema.optional()
})

export const ledsCurrentAppearanceSchema = z.object({
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
  ownerCode: forceStationCodeSchema,
  checkname: checkNameSchema,
  personUrn: z.string(),
  remandDate: dateStringSchema,
  appearanceResult: appearanceResultSchema,
  currentAppearance: ledsCurrentAppearanceSchema.optional(),
  nextAppearance: ledsNextAppearanceSchema.optional(),
  localAuthority: localAuthoritySchema.optional(),
  bailConditions: z.array(z.string().min(1).max(203))
})
