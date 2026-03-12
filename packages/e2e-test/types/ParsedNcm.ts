type AdditionalOffenceResultFieldsForSeedingTestData = {
  DisposalEffectiveDate?: string
}

export type ParsedNcmOffenceResult = AdditionalOffenceResultFieldsForSeedingTestData & {
  ResultCode: number
  ResultText: string
}

type AdditionalOffenceFieldsForSeedingTestData = {
  DisposalGroup?: string
}

export type ParsedNcmOffence = AdditionalOffenceFieldsForSeedingTestData & {
  BaseOffenceDetails: {
    OffenceCode: string
    OffenceSequenceNumber: number
    OffenceWording: string
    LocationOfOffence: string
    OffenceTiming: {
      OffenceStart: {
        OffenceDateStartDate: string
        OffenceDateStartTime?: string
      }
      OffenceEnd?: {
        OffenceEndDate: string
        OffenceEndTime?: string
      }
    }
  }
  InitiatedDate: string
  Plea: string
  ModeOfTrial: string
  FinalDisposalIndicator: string
  ConvictionDate: string
  Finding: string
  Result: ParsedNcmOffenceResult | ParsedNcmOffenceResult[]
}

type ParsedNcm = {
  NewCaseMessage: {
    Case: {
      InitialHearing: {
        CourtHearingLocation: string
        DateOfHearing: string
      }
      Defendant: {
        ProsecutorReference: string
        PoliceIndividualDefendant: {
          PersonDefendant: {
            BasePersonDetails: {
              PersonName: {
                PersonFamilyName: string
                PersonGivenName1: string
                PersonGivenName2: string
                PersonGivenName3: string
              }
              Birthdate: string
              Gender: number
            }
          }
        }
        Offence: ParsedNcmOffence | ParsedNcmOffence[]
      }
      PTIURN: string
    }
  }
}

export default ParsedNcm
