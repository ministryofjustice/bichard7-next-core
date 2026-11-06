import type ExceptionCode from "./ExceptionCode"
import type TriggerCode from "./TriggerCode"

export type { DateCode } from "./DateCode"
export type { Duration } from "./Duration"
export type { GenderCode } from "./GenderCode"
export type { RemandStatusCode } from "./RemandStatusCode"
export type { default as TriggerCode } from "./TriggerCode"

export type CjsCodeAndDescription = {
  cjsCode: string
  description: string
}

export type ActualOffenceDate = CjsCodeAndDescription
export type Amount = CjsCodeAndDescription

export type AlcoholLevelMethod = {
  cjsCode: string
  description: string
  spiCode: string
}

export type Country = CjsCodeAndDescription
export type CourtType = CjsCodeAndDescription

export type CrestDisposal = {
  amountInResult: string
  amountInResultType: string
  dateInResult: string
  disposalCode: string
  duration: string
  durationType: string
  durationUnit: string
  exception?: string
  hoQualifiers: string
  hoResultCode: string
  id: string
  needsMapping: string
  numberInResult: string
  numberInResultType: string
  qData: string
  qDilSeqNo: string
  rData: string
  rDilSeqNo: string
  template: string
  timeInResult: string
}

export type DefendantPresentAtHearing = CjsCodeAndDescription
export type DurationType = CjsCodeAndDescription

export type DurationUnit = {
  cjsCode: string
  description: string
  pncCode: string
  spiCode: string
  xhibitCode: string
}

export type Gender = DurationUnit

export type ModeOfTrialReason = {
  cjsCode: string
  description: string
  spiCode: string
}

export type Number = CjsCodeAndDescription
export type OffenceCategory = CjsCodeAndDescription

export type OffenceCode = {
  cjsCode: string
  description: string
  homeOfficeClassification: string
  notifiableToHo?: boolean
  offenceCategory: string
  offenceTitle: string
  recordableOnPnc?: boolean
}

export type OffenceInitiation = CjsCodeAndDescription

export type OrganisationUnit = {
  bottomLevelCode: string
  bottomLevelName?: string
  secondLevelCode: string
  secondLevelName?: string
  thirdLevelCode: string
  thirdLevelName?: string
  thirdLevelPsaCode: string
  topLevelCode: string
  topLevelName: string
}

export type PleaStatus = {
  cjsCode: string
  description: string
  pncCode: string
  spiCode: string
}

export type PncCourtMapping = {
  cjsCode: string
  description: string
  pncCode: string
}

export type PncDisposal = {
  cjsCode: string
  description: string
  pncAdjudication: string
  pncNonAdjudication: string
}

export type Qualifier = CjsCodeAndDescription
export type RemandStatus = PleaStatus
export type ResultClass = CjsCodeAndDescription

export type ResultCode = {
  cjsCode: string
  description: string
  recordableOnPnc?: string
  resultCodeQualifiers: string
  resultHalfLifeHours: string
  type: string
}

export type ResultQualifierCode = CjsCodeAndDescription
export type Summons = CjsCodeAndDescription
export type TargetCourtType = CjsCodeAndDescription
export type TypeOfHearing = CjsCodeAndDescription
export type VehicleCode = CjsCodeAndDescription
export type Verdict = PleaStatus
export type YesNo = CjsCodeAndDescription

export type TriggerDefinition = {
  code: TriggerCode
  description: string
  shortDescription: string
  pncScreenToUpdate?: string
  cjsResultCode?: string
}

export type ExceptionDefinition = {
  code: ExceptionCode
  description: string
  shortDescription: string
  cause: string
  correctingThisError: string
  avoidingThisError: string
  details?: Omit<ExceptionDefinition, "details" | "code">[]
}

export type ExcludedTriggerConfig = {
  [key: string]: TriggerCode[]
}

export type Force = {
  code: string
  name: string
}
