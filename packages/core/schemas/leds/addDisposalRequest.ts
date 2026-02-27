import z from "zod"

import {
  adjudicationSchema,
  baseOffenceSchema,
  courtCaseReferenceSchema,
  courtSchema,
  dateStringSchema,
  forceStationCodeSchema,
  updateOffenceSchema
} from "./common"

const otherTicSchema = z.number().min(0).max(9999)

export const defendantSchema = z.discriminatedUnion("defendantType", [
  z.object({
    defendantType: z.literal("individual"),
    defendantFirstNames: z.array(z.string()).optional(),
    defendantLastName: z.string().nonempty()
  }),
  z.object({
    defendantType: z.literal("organisation"),
    defendantOrganisationName: z.string().nonempty()
  })
])

const locationAddressSchema = z.object({
  description: z.string().optional(),
  locationText: z.string()
})

const offenceCodeSchema = z.discriminatedUnion("offenceCodeType", [
  z.object({
    description: z.string().optional(),
    offenceCodeType: z.literal("cjs"),
    cjsOffenceCode: z.string().length(7)
  }),
  z.object({
    description: z.string().optional(),
    offenceCodeType: z.literal("npcc"),
    npccOffenceCode: z.string().regex(/^([0-9]{1,3}\\.){1,2}[0-9]{1,3}(\\.[0-9]{1,3})?$/)
  })
])

export const arrestOffenceSchema = baseOffenceSchema.extend({
  offenceStartDate: dateStringSchema,
  adjudication: adjudicationSchema.optional(),
  offenceDescription: z.string().optional(),
  committedOnBail: z.boolean(),
  locationFsCode: z.string().nonempty(),
  locationText: locationAddressSchema.optional(),
  dateOfSentence: dateStringSchema.optional(),
  offenceCode: offenceCodeSchema,
  locationAddress: z
    .object({
      addressLines: z.array(z.string()).optional(),
      postcode: z.string().optional()
    })
    .optional()
})

export const additionalArrestOffencesSchema = z.object({
  asn: z.string().nonempty(),
  additionalOffences: z.array(arrestOffenceSchema)
})

export const carryForwardSchema = z.object({
  appearanceDate: dateStringSchema,
  court: courtSchema
})

export const addDisposalRequestSchema = z.object({
  ownerCode: forceStationCodeSchema,
  personUrn: z.string().nonempty(),
  courtCaseReference: courtCaseReferenceSchema,
  court: courtSchema.optional(),
  dateOfConviction: dateStringSchema,
  defendant: defendantSchema,
  otherTic: otherTicSchema.optional(),
  carryForward: carryForwardSchema.optional(),
  referToCourtCase: z
    .object({
      reference: z.string().nonempty(),
      text: z.string().optional()
    })
    .optional(),
  offences: updateOffenceSchema.array().optional(),
  additionalArrestOffences: additionalArrestOffencesSchema.array().optional()
})
