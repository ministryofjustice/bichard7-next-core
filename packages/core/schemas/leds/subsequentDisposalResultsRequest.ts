import z from "zod"

import {
  checkNameSchema,
  courtCaseReferenceSchema,
  courtSchema,
  dateStringSchema,
  forceStationCodeSchema,
  offenceSchema
} from "./common"

export const reasonForAppearanceSchema = z.enum(["Sentenced Deferred", "Heard at Court", "Subsequently Varied"])

export const subsequentDisposalResultsRequestSchema = z.object({
  ownerCode: forceStationCodeSchema,
  personUrn: z.string().nonempty(),
  checkName: checkNameSchema,
  courtCaseReference: courtCaseReferenceSchema,
  court: courtSchema.optional(),
  appearanceDate: dateStringSchema,
  reasonForAppearance: reasonForAppearanceSchema,
  offences: offenceSchema.array().optional()
})
