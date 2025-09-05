import z from "zod"

import {
  checkNameSchema,
  courtCaseReferenceSchema,
  courtSchema,
  dateStringSchema,
  forceStationCodeSchema,
  offenceSchema
} from "./common"

const reasonForAppearanceSchema = z.enum(["Sentenced Deferred", "Heard at Court", "Subsequently Varied"])

export const subsequentDisposalResultsRequestSchema = z.object({
  ownerCode: forceStationCodeSchema,
  personUrn: z.string(),
  checkName: checkNameSchema,
  courtCaseReference: courtCaseReferenceSchema,
  court: courtSchema.optional(),
  appearanceDate: dateStringSchema,
  reasonForAppearance: reasonForAppearanceSchema,
  offences: offenceSchema.array().optional()
})
