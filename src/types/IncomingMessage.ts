export type ResultParsedXml = {
  ResultCode: number
  ResultText: string
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
  Plea: number
  ModeOfTrial: number
  FinalDisposalIndicator: string
  ConvictionDate: string
  Finding: string
  Result: T
}

export type GenericResultedCaseMessageParsedXml<T> = {
  Session: {
    Case: {
      PTIURN: string
      Defendant: {
        Offence: T
        ProsecutorReference: string
        CourtIndividualDefendant: {
          PersonDefendant: {
            BasePersonDetails: {
              PersonName: {
                PersonTitle: string
                PersonGivenName1: string
                PersonFamilyName: string
              }
            }
          }
        }
      }
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
