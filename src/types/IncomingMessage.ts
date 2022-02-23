import type { Plea } from "./Plea"

export type ResultParsedXml = {
  ResultCode: number
  ResultText: string
  ResultCodeQualifier?: string
  Outcome: {
    ResultAmountSterling?: string
  }
}

export type GenericOffenceParsedXml<T> = {
  BaseOffenceDetails: {
    OffenceSequenceNumber: number
    OffenceCode: string
    OffenceWording: string
    ChargeDate: string
    ArrestDate: string
    LocationOfOffence: string
    ConvictionDate: string
    AlcoholRelatedOffence: {
      AlcoholLevelAmount: number
      AlcoholLevelMethod: string
    }
    OffenceTiming: {
      OffenceDateCode: number
      OffenceStart: {
        OffenceDateStartDate: string
      }
      OffenceEnd: {
        OffenceEndDate: string
      }
    }
  }
  InitiatedDate: string
  Plea: Plea
  ModeOfTrial: number
  FinalDisposalIndicator: string
  ConvictionDate: string
  Finding: string
  Result: T
}

export interface SpiAddress {
  SimpleAddress: {
    AddressLine1: string
    AddressLine2: string
    AddressLine3: string
    AddressLine4: string
    AddressLine5: string
  }
  ComplexAddress: {
    PAON: string
    StreetDescription: string
    Locality: string
    Town: string
    UniqueStreetReferenceNumber: number
    AdministrativeArea: string
    PostCode: string
  }
}

export type GenericResultedCaseMessageParsedXml<T> = {
  Session: {
    Case: {
      PTIURN: string
      Defendant: {
        Offence: T
        ProsecutorReference: string
        CourtIndividualDefendant: {
          PresentAtHearing: string
          BailStatus: string
          PersonDefendant: {
            PNCidentifier: string
            BailConditions: string
            ReasonForBailConditionsOrCustody: string
            BasePersonDetails: {
              Birthdate: string
              Gender: string
              PersonName: {
                PersonTitle: string
                PersonGivenName1: string
                PersonGivenName2?: string
                PersonGivenName3?: string
                PersonFamilyName: string
              }
            }
          }
          Address: SpiAddress
        }
        CourtCorporateDefendant: {
          PNCidentifier: string
          PresentAtHearing: string
          BailStatus: string
          OrganisationName: {
            OrganisationName: string
          }
          Address: SpiAddress
        }
      }
    }
    CourtHearing: {
      Hearing: {
        CourtHearingLocation: string
        DateOfHearing: string
        TimeOfHearing: string
      }
      PSAcode: number
    }
  }
}

export type RawOffenceParsedXml = GenericOffenceParsedXml<ResultParsedXml | ResultParsedXml[]>
export type RawResultedCaseMessageParsedXml = GenericResultedCaseMessageParsedXml<
  undefined | OffenceParsedXml | OffenceParsedXml[]
>

export type OffenceParsedXml = GenericOffenceParsedXml<ResultParsedXml[]>
export type ResultedCaseMessageParsedXml = GenericResultedCaseMessageParsedXml<OffenceParsedXml[]>

export type RawIncomingMessageParsedXml = {
  DeliverRequest: {
    Message: {
      ResultedCaseMessage: RawResultedCaseMessageParsedXml
    }
  }
}
