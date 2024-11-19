import type { Change } from "diff"

import type PncUpdateRequest from "../../phase3/types/PncUpdateRequest"
import type Exception from "../../types/Exception"
import type { Trigger } from "../../types/Trigger"

export type ComparisonResultDebugOutput = {
  auditLogEvents: {
    comparisonResult: string[]
    coreResult: string[]
  }
  exceptions: {
    comparisonResult: Exception[]
    coreResult: Exception[]
  }
  triggers: {
    comparisonResult: Trigger[]
    coreResult: Trigger[]
  }
  xmlOutputDiff: Change[]
  xmlParsingDiff: Change[]
}

export type Phase3ComparisonResultDebugOutput = {
  pncOperations: {
    comparisonResult: PncUpdateRequest[]
    coreResult: PncUpdateRequest[]
  }
} & ComparisonResultDebugOutput

type ComparisonResultDetail = {
  auditLogEventsMatch: boolean
  correlationId?: string
  debugOutput?: ComparisonResultDebugOutput
  error?: unknown
  exceptionsMatch: boolean
  file?: string
  incomingMessageType?: string
  intentionalDifference?: boolean
  skipped?: boolean
  triggersMatch: boolean
  xmlOutputMatches: boolean
  xmlParsingMatches: boolean
}

export type Phase3ComparisonResultDetail = {
  debugOutput?: Phase3ComparisonResultDebugOutput
  pncOperationsMatch: boolean
} & ComparisonResultDetail

export default ComparisonResultDetail
