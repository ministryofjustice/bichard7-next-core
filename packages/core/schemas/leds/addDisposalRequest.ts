import z from "zod"

import {
  baseOffenceSchema,
  checkNameSchema,
  courtCaseReferenceSchema,
  courtSchema,
  dateStringSchema,
  forceStationCodeSchema,
  offenceSchema
} from "./common"

const otherTicSchema = z.number().min(0).max(9999)

export const defendantSchema = z.discriminatedUnion("defendantType", [
  z.object({
    defendantType: z.literal("individual"),
    defendantFirstNames: z.array(z.string()).optional(),
    defendantLastName: z.string()
  }),
  z.object({
    defendantType: z.literal("organisation"),
    defendantOrganisationName: z.string()
  })
])

const arrestOffenceSchema = baseOffenceSchema.extend(
  z.object({
    offenceStartDate: dateStringSchema,
    offenceDescription: z.string().optional(),
    committedOnBail: z.boolean(),
    locationFsCode: z.string(),
    locationText: z.string().optional(),
    locationAddress: z
      .object({
        addressLines: z.array(z.string()).optional(),
        postcode: z.string().optional()
      })
      .optional()
  })
)

const additionalArrestOffencesSchema = z.object({
  asn: z.string(),
  additionalOffences: z.array(arrestOffenceSchema)
})

export const addDisposalRequestSchema = z.object({
  ownerCode: forceStationCodeSchema,
  personUrn: z.string(),
  checkName: checkNameSchema,
  courtCaseReference: courtCaseReferenceSchema,
  court: courtSchema.optional(),
  dateOfConviction: dateStringSchema,
  defendant: defendantSchema,
  otherTic: otherTicSchema.optional(),
  carryForward: z
    .object({
      appearanceDate: dateStringSchema.optional(),
      court: courtSchema.optional()
    })
    .optional(),
  referToCourtCase: z
    .object({
      reference: z.string(),
      text: z.string().optional()
    })
    .optional(),
  offences: z.array(offenceSchema).optional(),
  additionalArrestOffences: additionalArrestOffencesSchema.array().optional()
})
