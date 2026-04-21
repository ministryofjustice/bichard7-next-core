import z from "zod"

import {
  courtCaseReferenceSchema,
  courtSchema,
  dateStringSchema,
  forceStationCodeSchema,
  updateOffenceSchema
} from "./common"

export const reasonForAppearanceSchema = z.enum(["Sentence Deferred", "Heard at Court", "Subsequently Varied"])

export const subsequentDisposalResultsRequestSchema = z.object({
  // TEMP: Remove before PR approval
  pncCheckName: z.string(),
  croNumber: z.string(),
  crimeOffenceReferenceNumber: z.string(),
  // TEMP: Remove before PR approval
  ownerCode: forceStationCodeSchema,
  personUrn: z.string().nonempty(),
  courtCaseReference: courtCaseReferenceSchema,
  court: courtSchema.optional(),
  appearanceDate: dateStringSchema,
  reasonForAppearance: reasonForAppearanceSchema,
  offences: updateOffenceSchema.array().optional()
})
