import type TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import type PoliceUpdateRequest from "../../phase3/types/PoliceUpdateRequest"
import type ErrorListNoteRecord from "../../types/ErrorListNoteRecord"
import type ErrorListRecord from "../../types/ErrorListRecord"
import type ErrorListTriggerRecord from "../../types/ErrorListTriggerRecord"

export type Comparison = OldPhase1Comparison | Phase1Comparison | Phase2Comparison | Phase3Comparison

export type ComparisonTrigger = {
  code: TriggerCode
  identifier?: string
  offenceSequenceNumber?: number
}

export type DbRecords = {
  errorList: ErrorListRecord[]
  errorListNotes?: ErrorListNoteRecord[]
  errorListTriggers: ErrorListTriggerRecord[]
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
  dbContent?: DbRecords
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

export type Phase2E2eComparison = DatabaseE2eComparison & Phase2Comparison

export type Phase3Comparison = NewComparison & {
  auditLogEvents: string[]
  outgoingMessage?: string
  phase: 3
  pncOperations: PoliceUpdateRequest[]
  triggers?: ComparisonTrigger[]
}

export type Phase3E2eComparison = DatabaseE2eComparison &
  Phase3Comparison & {
    outgoingMessage: string
    triggers: ComparisonTrigger[]
  }

type DatabaseE2eComparison = {
  db: {
    after: DbRecords
    before: DbRecords
  }
}
