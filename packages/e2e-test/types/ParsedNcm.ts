export type ParsedNcmOffence = {
  BaseOffenceDetails: {
    OffenceCode: string
    OffenceSequenceNumber: number
    OffenceWording: string
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
      }
      Defendant: {
        ProsecutorReference: string
        PoliceIndividualDefendant: {
          PersonDefendant: {
            BasePersonDetails: {
              PersonName: {
                PersonFamilyName: string
              }
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
