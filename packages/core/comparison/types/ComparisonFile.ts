import type TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import type PncUpdateRequest from "../../phase3/types/PncUpdateRequest"
import type ErrorListRecord from "../../types/ErrorListRecord"
import type ErrorListTriggerRecord from "../../types/ErrorListTriggerRecord"

export type Comparison = OldPhase1Comparison | Phase1Comparison | Phase2Comparison | Phase3Comparison

export type ComparisonTrigger = {
  code: TriggerCode
  identifier?: string
  offenceSequenceNumber?: number
}

export type NewComparison = {
  correlationId: string
  file?: string
  incomingMessage: string
  phase: number
  standingDataVersion: string
}

export type OldPhase1Comparison = {
  annotatedHearingOutcome: string
  auditLogEvents?: string[]
  dbContent?: { errorList: ErrorListRecord[]; errorListTriggers: ErrorListTriggerRecord[] }
  file?: string
  incomingMessage: string
  standingDataVersion: string
  triggers: ComparisonTrigger[]
}

export type Phase1Comparison = NewComparison & {
  annotatedHearingOutcome: string
  phase: 1
  sentToPhase2: boolean
  triggers: ComparisonTrigger[]
}

export type Phase2Comparison = NewComparison & {
  auditLogEvents: string[]
  outgoingMessage: string
  phase: 2
  sentToPhase3: boolean
  triggers: ComparisonTrigger[]
}

export type Phase3Comparison = NewComparison & {
  auditLogEvents: string[]
  outgoingMessage?: string
  phase: 3
  pncOperations: PncUpdateRequest[]
  triggers?: ComparisonTrigger[]
}
