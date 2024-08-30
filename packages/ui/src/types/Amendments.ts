export type Amendments = {
  asn?: string
  offenceReasonSequence?: OffenceField<number>[]
  offenceCourtCaseReferenceNumber?: OffenceField<string>[]
  courtCaseReference?: OffenceField<string>[]
  resultQualifierCode?: ResultQualifierCode[]
  nextSourceOrganisation?: ResultField<string>[]
  nextHearingDate?: ResultField<string>[]
  courtPNCIdentifier?: string
  resultVariableText?: ResultField<string>[]
  courtReference?: string
  courtOffenceSequenceNumber?: OffenceField<number>[]
  forceOwner?: string
  noUpdatesResubmit?: boolean
}

export type AmendmentKeys = keyof Amendments

type Unpacked<T> = T extends (infer U)[] ? U : T

export type Amender = <T extends AmendmentKeys>(amendmentKey: T) => (newValue: Unpacked<Amendments[T]>) => void

export type OffenceField<T> = {
  offenceIndex: number
  value?: T
}

export type ResultField<T> = OffenceField<T> & {
  resultIndex: number
}

export type ResultQualifierCode = OffenceField<string> & {
  resultIndex?: number
  resultQualifierIndex: number
}

export enum ValidProperties {
  NextResultSourceOrganisation = "NextResultSourceOrganisation",
  NextHearingDate = "NextHearingDate",
  ResultVariableText = "ResultVariableText"
}
