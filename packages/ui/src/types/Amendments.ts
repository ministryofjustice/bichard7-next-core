export type Amendments = {
  asn?: string
  courtCaseReference?: OffenceField<string>[]
  courtOffenceSequenceNumber?: OffenceField<number>[]
  courtPNCIdentifier?: string
  courtReference?: string
  forceOwner?: string
  nextHearingDate?: ResultField<string>[]
  nextSourceOrganisation?: ResultField<string>[]
  noUpdatesResubmit?: boolean
  offenceCourtCaseReferenceNumber?: OffenceField<string>[]
  offenceReasonSequence?: OffenceField<number>[]
  resultQualifierCode?: ResultQualifierCode[]
  resultVariableText?: ResultField<string>[]
}

export type AmendmentKeys = keyof Amendments

type Unpacked<T> = T extends (infer U)[] ? U : T

export type Amender = <T extends AmendmentKeys>(amendmentKey: T) => (newValue: Unpacked<Amendments[T]>) => void

export type OffenceField<T> = {
  offenceIndex: number
  value?: T
}

export type ResultField<T> = {
  resultIndex: number
} & OffenceField<T>

export type ResultQualifierCode = {
  resultIndex?: number
  resultQualifierIndex: number
} & OffenceField<string>

export enum ValidProperties {
  NextHearingDate = "NextHearingDate",
  NextResultSourceOrganisation = "NextResultSourceOrganisation",
  ResultVariableText = "ResultVariableText"
}
