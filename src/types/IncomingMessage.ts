import { z } from "zod"
import { spiPleaSchema } from "./Plea"

const toArray = <T>(element: unknown): T[] => (!element ? [] : !Array.isArray(element) ? [element] : element)

const nextHearingDetailsSchema = z.object({
  CourtHearingLocation: z.string(),
  DateOfHearing: z.string(),
  TimeOfHearing: z.string()
})

const nextHearingSchema = z.object({
  BailStatusOffence: z.string().optional(),
  NextHearingDetails: nextHearingDetailsSchema
})

const durationSchema = z.object({
  DurationValue: z.number().optional(),
  DurationUnit: z.string().optional(),
  SecondaryDurationValue: z.number().optional(),
  SecondaryDurationUnit: z.string().optional(),
  DurationStartDate: z.preprocess(toArray, z.string().array().min(0)),
  DurationEndDate: z.preprocess(toArray, z.string().array().min(0))
})

const outcomeSchema = z.object({
  ResultAmountSterling: z.number().optional(),
  PenaltyPoints: z.number().optional(),
  Duration: durationSchema.optional()
})

const resultParsedXmlSchema = z.object({
  ResultCode: z.number().optional(),
  ResultText: z.string(),
  ResultCodeQualifier: z.preprocess(toArray, z.string().array().min(0)),
  Outcome: outcomeSchema.optional(),
  NextHearing: nextHearingSchema.optional()
})

const offenceParsedXmlSchema = z.object({
  BaseOffenceDetails: z.object({
    OffenceSequenceNumber: z.number(),
    OffenceCode: z.string(),
    OffenceWording: z.string(),
    ChargeDate: z.string().optional(),
    ArrestDate: z.string().optional(),
    LocationOfOffence: z.string(),
    OffenceTitle: z.string().optional(),
    ConvictionDate: z.string().optional(),
    AlcoholRelatedOffence: z
      .object({
        AlcoholLevelAmount: z.number(),
        AlcoholLevelMethod: z.string()
      })
      .optional(),
    OffenceTiming: z.object({
      OffenceDateCode: z.number(),
      OffenceStart: z.object({
        OffenceDateStartDate: z.string(),
        OffenceStartTime: z.string().optional()
      }),
      OffenceEnd: z
        .object({
          OffenceEndDate: z.string(),
          OffenceEndTime: z.string().optional()
        })
        .optional()
    })
  }),
  InitiatedDate: z.string(),
  Plea: spiPleaSchema,
  ModeOfTrial: z.number().optional(),
  FinalDisposalIndicator: z.string(),
  ConvictionDate: z.string().optional(),
  ConvictingCourt: z.preprocess((s) => (s ? String(s) : undefined), z.string().optional()),
  Finding: z.string().optional(),
  Result: z.preprocess(toArray, resultParsedXmlSchema.array().min(0))
})

const simpleAddressSchema = z.object({
  SimpleAddress: z.object({
    AddressLine1: z.string(),
    AddressLine2: z.string().optional(),
    AddressLine3: z.string().optional(),
    AddressLine4: z.string().optional(),
    AddressLine5: z.string().optional()
  })
})

const complexAddressSchema = z.object({
  ComplexAddress: z.object({
    PAON: z.string().optional(),
    StreetDescription: z.string().optional(),
    Locality: z.string().optional(),
    Town: z.string().optional(),
    UniqueStreetReferenceNumber: z.number().optional(),
    AdministrativeArea: z.string().optional(),
    PostCode: z.string().optional()
  })
})

const spiAddressSchema = z.union([simpleAddressSchema, complexAddressSchema])

const spiCourtIndividualDefendantSchema = z.object({
  PresentAtHearing: z.string(),
  BailStatus: z.string(),
  PersonDefendant: z.object({
    PNCidentifier: z.string().optional(),
    BailConditions: z.string().optional(),
    ReasonForBailConditionsOrCustody: z.string().optional(),
    BasePersonDetails: z.object({
      Birthdate: z.string().optional(),
      Gender: z.number(),
      PersonName: z.object({
        PersonTitle: z.string().optional(),
        PersonGivenName1: z.string(),
        PersonGivenName2: z.string().optional(),
        PersonGivenName3: z.string().optional(),
        PersonFamilyName: z.string()
      })
    })
  }),
  Address: spiAddressSchema,
  ReasonForBailConditionsOrCustody: z.string().optional()
})

const spiCourtCorporateDefendantSchema = z.object({
  PNCidentifier: z.string().optional(),
  PresentAtHearing: z.string(),
  BailStatus: z.string(),
  OrganisationName: z.object({
    OrganisationName: z.string()
  }),
  Address: spiAddressSchema
})

const defendantSchema = z
  .object({
    CourtIndividualDefendant: spiCourtIndividualDefendantSchema.optional(),
    CourtCorporateDefendant: spiCourtCorporateDefendantSchema.optional(),
    Offence: z.preprocess(toArray, offenceParsedXmlSchema.array().min(0)),
    ProsecutorReference: z.string()
  })
  .refine(
    (d) =>
      !(
        (!("CourtCorporateDefendant" in d) && !("CourtIndividualDefendant" in d)) ||
        ("CourtCorporateDefendant" in d && "CourtIndividualDefendant" in d)
      ),
    "Either CourtIndividualDefendant or CourtCorporateDefendant should exist."
  )

const resultedCaseMessageParsedXmlSchema = z.object({
  Session: z.object({
    Case: z.object({
      PTIURN: z.string(),
      Defendant: defendantSchema
    }),
    CourtHearing: z.object({
      Hearing: z.object({
        CourtHearingLocation: z.string(),
        DateOfHearing: z.string(),
        TimeOfHearing: z.string()
      }),
      PSAcode: z.number()
    })
  })
})

const incomingMessageParsedXmlSchema = z.object({
  DeliverRequest: z.object({
    MessageIdentifier: z.string(),
    Message: z.object({
      ResultedCaseMessage: resultedCaseMessageParsedXmlSchema
    })
  })
})

export type ResultParsedXml = z.infer<typeof resultParsedXmlSchema>
export type OffenceParsedXml = z.infer<typeof offenceParsedXmlSchema>
export type SpiAddress = z.infer<typeof spiAddressSchema>
export type SpiCourtIndividualDefendant = z.infer<typeof spiCourtIndividualDefendantSchema>
export type SpiOffence = z.infer<typeof offenceParsedXmlSchema>
export type SpiResult = z.infer<typeof resultParsedXmlSchema>
export type ResultedCaseMessageParsedXml = z.infer<typeof resultedCaseMessageParsedXmlSchema>
export type IncomingMessageParsedXml = z.infer<typeof incomingMessageParsedXmlSchema>

export { incomingMessageParsedXmlSchema }
