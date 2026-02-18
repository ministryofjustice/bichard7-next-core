export type ParsedNcmOffence = {
  BaseOffenceDetails: {
    OffenceCode: string
    OffenceSequenceNumber: number
    OffenceWording: string
    LocationOfOffence: string
    OffenceTiming: {
      OffenceStart: {
        OffenceDateStartDate: string
      }
      OffenceEnd: {
        OffenceEndDate: string
      }
    }
  }
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
