import { z } from "zod"
import toArray from "../../schemas/toArray"
import { SpiPlea } from "../../types/Plea"

export const spiPleaSchema = z.nativeEnum(SpiPlea)

export const nextHearingDetailsSchema = z.object({
  CourtHearingLocation: z.string().optional(),
  DateOfHearing: z.string(),
  TimeOfHearing: z.string()
})

export const nextHearingSchema = z.object({
  BailStatusOffence: z.string().optional(),
  NextHearingDetails: nextHearingDetailsSchema
})

export const durationSchema = z.object({
  DurationValue: z.string().optional(),
  DurationUnit: z.string().optional(),
  SecondaryDurationValue: z.string().optional(),
  SecondaryDurationUnit: z.string().optional(),
  DurationStartDate: z.preprocess(toArray, z.string().array().min(0)),
  DurationEndDate: z.preprocess(toArray, z.string().array().min(0))
})

export const outcomeSchema = z.object({
  ResultAmountSterling: z.string().optional(),
  PenaltyPoints: z.string().optional(),
  Duration: durationSchema.optional()
})

export const resultParsedXmlSchema = z.object({
  ResultCode: z.string().optional(),
  ResultText: z.string(),
  ResultCodeQualifier: z.preprocess(toArray, z.string().array().min(0)),
  Outcome: outcomeSchema.optional(),
  NextHearing: nextHearingSchema.optional()
})

export const offenceParsedXmlSchema = z.object({
  BaseOffenceDetails: z.object({
    OffenceSequenceNumber: z.string(),
    OffenceCode: z.string(),
    OffenceWording: z.string(),
    ChargeDate: z.string().optional(),
    ArrestDate: z.string().optional(),
    LocationOfOffence: z.string().optional(),
    OffenceTitle: z.string().optional(),
    ConvictionDate: z.string().optional(),
    AlcoholRelatedOffence: z
      .object({
        AlcoholLevelAmount: z.string(),
        AlcoholLevelMethod: z.string()
      })
      .optional(),
    OffenceTiming: z.object({
      OffenceDateCode: z.string(),
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
  ModeOfTrial: z.string().optional(),
  FinalDisposalIndicator: z.string(),
  ConvictionDate: z.string().optional(),
  ConvictingCourt: z.preprocess((s) => (s ? String(s) : undefined), z.string().optional()),
  Finding: z.string().optional(),
  Result: z.preprocess(toArray, resultParsedXmlSchema.array().min(0))
})

export const simpleAddressSchema = z.object({
  SimpleAddress: z.object({
    AddressLine1: z.string(),
    AddressLine2: z.string().optional(),
    AddressLine3: z.string().optional(),
    AddressLine4: z.string().optional(),
    AddressLine5: z.string().optional()
  })
})

export const complexAddressSchema = z.object({
  ComplexAddress: z.object({
    PAON: z.string().optional(),
    StreetDescription: z.string().optional(),
    Locality: z.string().optional(),
    Town: z.string().optional(),
    UniqueStreetReferenceNumber: z.string().optional(),
    AdministrativeArea: z.string().optional(),
    PostCode: z.string().optional()
  })
})

export const spiAddressSchema = z.union([simpleAddressSchema, complexAddressSchema])

export const spiCourtIndividualDefendantSchema = z.object({
  PresentAtHearing: z.string(),
  BailStatus: z.string(),
  PersonDefendant: z.object({
    PNCidentifier: z.string().optional(),
    BailConditions: z.string().optional(),
    BasePersonDetails: z.object({
      Birthdate: z.string().optional(),
      Gender: z.string(),
      PersonName: z.object({
        PersonTitle: z.string().optional(),
        PersonGivenName1: z.string().optional(),
        PersonGivenName2: z.string().optional(),
        PersonGivenName3: z.string().optional(),
        PersonFamilyName: z.string()
      })
    })
  }),
  Address: spiAddressSchema,
  ReasonForBailConditionsOrCustody: z.string().optional()
})

export const spiCourtCorporateDefendantSchema = z.object({
  PNCidentifier: z.string().optional(),
  PresentAtHearing: z.string(),
  BailStatus: z.string(),
  OrganisationName: z.object({
    OrganisationName: z.string()
  }),
  Address: spiAddressSchema
})

// TODO: See if it's possible to make CourtIndividualDefendant and CourtCorporateDefendant mutually exclusive
export const defendantSchema = z
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

export const resultedCaseMessageParsedXmlSchema = z.object({
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
      PSAcode: z.string()
    })
  })
})

export const fullResultedCaseMessageParsedXmlSchema = z.object({
  ResultedCaseMessage: resultedCaseMessageParsedXmlSchema
})

export const incomingMessageParsedXmlSchema = z.object({
  DeliverRequest: z.object({
    MessageIdentifier: z.string(),
    Message: fullResultedCaseMessageParsedXmlSchema
  })
})
