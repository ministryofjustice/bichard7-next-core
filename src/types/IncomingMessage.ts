import { pleaSchema } from "./Plea"
import { z } from "zod"

const toArray = <T>(element: unknown): T[] => (!element ? [] : !Array.isArray(element) ? [element] : element)

const resultParsedXml = z.object({
  ResultCode: z.number(),
  ResultText: z.string(),
  ResultCodeQualifier: z.string().optional(),
  Outcome: z
    .object({
      ResultAmountSterling: z.number().optional()
    })
    .optional()
})

export type ResultParsedXml = z.infer<typeof resultParsedXml>

const offenceParsedXml = z.object({
  BaseOffenceDetails: z.object({
    OffenceSequenceNumber: z.number(),
    OffenceCode: z.string(),
    OffenceWording: z.string(),
    ChargeDate: z.string().optional(),
    ArrestDate: z.string().optional(),
    LocationOfOffence: z.string(),
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
        OffenceDateStartDate: z.string()
      }),
      OffenceEnd: z
        .object({
          OffenceEndDate: z.string()
        })
        .optional()
    })
  }),
  InitiatedDate: z.string(),
  Plea: pleaSchema,
  ModeOfTrial: z.number(),
  FinalDisposalIndicator: z.string(),
  ConvictionDate: z.string().optional(),
  Finding: z.string().optional(),
  Result: z.preprocess(toArray, resultParsedXml.array().min(0))
})

export type OffenceParsedXml = z.infer<typeof offenceParsedXml>

const simpleAddress = z.object({
  SimpleAddress: z.object({
    AddressLine1: z.string(),
    AddressLine2: z.string().optional(),
    AddressLine3: z.string().optional(),
    AddressLine4: z.string().optional(),
    AddressLine5: z.string().optional()
  })
})

const complexAddress = z.object({
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

const spiAddress = z.union([simpleAddress, complexAddress])

export type SpiAddress = z.infer<typeof spiAddress>

const spiCourtIndividualDefendant = z.object({
  PresentAtHearing: z.string(),
  BailStatus: z.string(),
  PersonDefendant: z.object({
    PNCidentifier: z.string().optional(),
    BailConditions: z.string().optional(),
    ReasonForBailConditionsOrCustody: z.string().optional(),
    BasePersonDetails: z.object({
      Birthdate: z.string(),
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
  Address: spiAddress
})

const spiCourtCorporateDefendant = z.object({
  PNCidentifier: z.string().optional(),
  PresentAtHearing: z.string(),
  BailStatus: z.string(),
  OrganisationName: z.object({
    OrganisationName: z.string()
  }),
  Address: spiAddress
})

export type SpiCourtIndividualDefendant = z.infer<typeof spiCourtIndividualDefendant>

const defendant = z
  .object({
    CourtIndividualDefendant: spiCourtIndividualDefendant.optional(),
    CourtCorporateDefendant: spiCourtCorporateDefendant.optional(),
    Offence: z.preprocess(toArray, offenceParsedXml.array().min(0)),
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

const resultedCaseMessageParsedXml = z.object({
  Session: z.object({
    Case: z.object({
      PTIURN: z.string(),
      Defendant: defendant
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

export type ResultedCaseMessageParsedXml = z.infer<typeof resultedCaseMessageParsedXml>

const incomingMessageParsedXml = z.object({
  DeliverRequest: z.object({
    Message: z.object({
      ResultedCaseMessage: resultedCaseMessageParsedXml
    })
  })
})

export type IncomingMessageParsedXml = z.infer<typeof incomingMessageParsedXml>

export { incomingMessageParsedXml }
