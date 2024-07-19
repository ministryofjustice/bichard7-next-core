import type TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type ErrorListRecord from "../../types/ErrorListRecord"
import type ErrorListTriggerRecord from "../../types/ErrorListTriggerRecord"

export type ComparisonTrigger = {
  code: TriggerCode
  identifier?: string
  offenceSequenceNumber?: number
}

export type OldPhase1Comparison = {
  incomingMessage: string
  annotatedHearingOutcome: string
  standingDataVersion: string
  triggers: ComparisonTrigger[]
  file?: string
  dbContent?: { errorList: ErrorListRecord[]; errorListTriggers: ErrorListTriggerRecord[] }
  auditLogEvents?: string[]
}

export type NewComparison = {
  phase: number
  correlationId: string
  incomingMessage: string
  standingDataVersion: string
  file?: string
}

export type Phase1Comparison = NewComparison & {
  phase: 1
  annotatedHearingOutcome: string
  triggers: ComparisonTrigger[]
  sentToPhase2: boolean
}

export type Phase2Comparison = NewComparison & {
  phase: 2
  outgoingMessage: string
  triggers: ComparisonTrigger[]
  auditLogEvents: string[]
  sentToPhase3: boolean
}

export type PncOperation = {
  operation: string
  request: object
}

export type Phase3Comparison = NewComparison & {
  phase: 3
  auditLogEvents: string[]
  pncOperations: PncOperation[]
}

export type Comparison = OldPhase1Comparison | Phase1Comparison | Phase2Comparison | Phase3Comparison
