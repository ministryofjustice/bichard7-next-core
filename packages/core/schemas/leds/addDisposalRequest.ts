import z from "zod"

import {
  adjudicationSchema,
  baseOffenceSchema,
  courtCaseReferenceSchema,
  courtSchema,
  dateStringSchema,
  disposalResultSchema,
  forceStationCodeSchema,
  updateOffenceSchema,
  updateOffenceTimeStringSchema
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
  locationText: z.string().min(1).max(64)
})

const offenceCodeSchema = z.discriminatedUnion("offenceCodeType", [
  z.object({
    offenceCodeType: z.literal("cjs"),
    cjsOffenceCode: z.string().length(7)
  }),
  z.object({
    offenceCodeType: z.literal("npcc"),
    npccOffenceCode: z.string().regex(/^([0-9]{1,3}\\.){1,2}[0-9]{1,3}(\\.[0-9]{1,3})?$/)
  }),
  z.object({
    offenceCodeType: z.literal("text"),
    description: z.string()
  })
])

export const arrestOffenceSchema = baseOffenceSchema.extend({
  offenceStartDate: dateStringSchema,
  disposalResults: disposalResultSchema.array(),
  adjudication: adjudicationSchema.optional(),
  offenceDescription: z.string().optional(),
  committedOnBail: z.boolean(),
  locationFsCode: z
    .string()
    .length(4)
    .regex(/^[0-9A-Za-z]*$/),
  locationText: locationAddressSchema.optional(),
  dateOfSentence: dateStringSchema.optional(),
  offenceCode: offenceCodeSchema,
  offenceStartTime: updateOffenceTimeStringSchema.optional(),
  offenceEndTime: updateOffenceTimeStringSchema.optional(),
  locationAddress: z
    .object({
      addressLines: z.array(z.string()).min(0).max(5).optional(),
      postcode: z
        .string()
        .regex(/^([a-zA-Z]{1,2})[0-9][a-zA-Z0-9]? ?([0-9][a-zA-Z]{2})?$/)
        .max(8)
        .optional()
    })
    .optional()
})

export const additionalArrestOffencesSchema = z.object({
  asn: z.string().nonempty(),
  additionalOffences: z.array(arrestOffenceSchema).min(1)
})

export const carryForwardSchema = z.object({
  appearanceDate: dateStringSchema,
  court: courtSchema
})

const referToCourtCaseSchema = z.object({
  reference: z.string().nonempty(),
  text: z
    .string()
    .min(1)
    .max(64)
    .regex(/^(?![ .]$).{1,64}$/)
    .optional()
})

export const addDisposalRequestSchema = z.object({
  ownerCode: forceStationCodeSchema,
  longPersonUrn: z.string().nonempty(),
  courtCaseReference: courtCaseReferenceSchema,
  court: courtSchema.optional(),
  dateOfConviction: dateStringSchema,
  defendant: defendantSchema,
  otherTic: otherTicSchema.optional(),
  carryForward: carryForwardSchema.optional(),
  referToCourtCase: referToCourtCaseSchema.optional(),
  offences: updateOffenceSchema.array().optional(),
  additionalArrestOffences: additionalArrestOffencesSchema.array().optional()
})
