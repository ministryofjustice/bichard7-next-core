import { z } from "zod"

import { SpiPlea } from "../types/Plea"
import toArray from "./toArray"

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
  DurationEndDate: z.preprocess(toArray, z.string().array().min(0)),
  DurationStartDate: z.preprocess(toArray, z.string().array().min(0)),
  DurationUnit: z.string().optional(),
  DurationValue: z.string().optional(),
  SecondaryDurationUnit: z.string().optional(),
  SecondaryDurationValue: z.string().optional()
})

export const outcomeSchema = z.object({
  Duration: durationSchema.optional(),
  PenaltyPoints: z.string().optional(),
  ResultAmountSterling: z.string().optional()
})

export const resultParsedXmlSchema = z.object({
  NextHearing: nextHearingSchema.optional(),
  Outcome: outcomeSchema.optional(),
  ResultCode: z.string().optional(),
  ResultCodeQualifier: z.preprocess(toArray, z.string().array().min(0)),
  ResultText: z.string()
})

export const offenceParsedXmlSchema = z.object({
  BaseOffenceDetails: z.object({
    AlcoholRelatedOffence: z
      .object({
        AlcoholLevelAmount: z.string(),
        AlcoholLevelMethod: z.string()
      })
      .optional(),
    ArrestDate: z.string().optional(),
    ChargeDate: z.string().optional(),
    ConvictionDate: z.string().optional(),
    LocationOfOffence: z.string().optional(),
    OffenceCode: z.string(),
    OffenceSequenceNumber: z.string(),
    OffenceTiming: z.object({
      OffenceDateCode: z.string(),
      OffenceEnd: z
        .object({
          OffenceEndDate: z.string(),
          OffenceEndTime: z.string().optional()
        })
        .optional(),
      OffenceStart: z.object({
        OffenceDateStartDate: z.string(),
        OffenceStartTime: z.string().optional()
      })
    }),
    OffenceTitle: z.string().optional(),
    OffenceWording: z.string()
  }),
  ConvictingCourt: z.preprocess((s) => (s ? String(s) : undefined), z.string().optional()),
  ConvictionDate: z.string().optional(),
  FinalDisposalIndicator: z.string(),
  Finding: z.string().optional(),
  InitiatedDate: z.string(),
  ModeOfTrial: z.string().optional(),
  Plea: spiPleaSchema,
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
    AdministrativeArea: z.string().optional(),
    Locality: z.string().optional(),
    PAON: z.string().optional(),
    PostCode: z.string().optional(),
    StreetDescription: z.string().optional(),
    Town: z.string().optional(),
    UniqueStreetReferenceNumber: z.string().optional()
  })
})

export const spiAddressSchema = z.union([simpleAddressSchema, complexAddressSchema])

export const spiCourtIndividualDefendantSchema = z.object({
  Address: spiAddressSchema,
  BailStatus: z.string(),
  PersonDefendant: z.object({
    BailConditions: z.string().optional(),
    BasePersonDetails: z.object({
      Birthdate: z.string().optional(),
      Gender: z.string(),
      PersonName: z.object({
        PersonFamilyName: z.string(),
        PersonGivenName1: z.string().optional(),
        PersonGivenName2: z.string().optional(),
        PersonGivenName3: z.string().optional(),
        PersonTitle: z.string().optional()
      })
    }),
    PNCidentifier: z.string().optional()
  }),
  PresentAtHearing: z.string(),
  ReasonForBailConditionsOrCustody: z.string().optional()
})

export const spiCourtCorporateDefendantSchema = z.object({
  Address: spiAddressSchema,
  BailStatus: z.string(),
  OrganisationName: z.object({
    OrganisationName: z.string()
  }),
  PNCidentifier: z.string().optional(),
  PresentAtHearing: z.string()
})

// TODO: See if it's possible to make CourtIndividualDefendant and CourtCorporateDefendant mutually exclusive
export const defendantSchema = z
  .object({
    CourtCorporateDefendant: spiCourtCorporateDefendantSchema.optional(),
    CourtIndividualDefendant: spiCourtIndividualDefendantSchema.optional(),
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
      Defendant: defendantSchema,
      PTIURN: z.string()
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
    Message: fullResultedCaseMessageParsedXmlSchema,
    MessageIdentifier: z.string()
  })
})
