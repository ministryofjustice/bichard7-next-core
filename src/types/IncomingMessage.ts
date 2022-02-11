export type ResultParsedXml = {
    ResultCode: number
    ResultText: string,
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
            Defendant: {
                Offence: T
            }
        }
    }
}

export type RawOffenceParsedXml = GenericOffenceParsedXml<ResultParsedXml | ResultParsedXml[]>
export type RawResultedCaseMessageParsedXml = GenericResultedCaseMessageParsedXml<undefined | OffenceParsedXml | OffenceParsedXml[]>

export type OffenceParsedXml = GenericOffenceParsedXml<ResultParsedXml[]>
export type ResultedCaseMessageParsedXml = GenericResultedCaseMessageParsedXml<OffenceParsedXml[]>

export type RawIncomingMessageParsedXml = {
    DeliverRequest: {
        Message: {
            ResultedCaseMessage: RawResultedCaseMessageParsedXml
        }
    }
}
