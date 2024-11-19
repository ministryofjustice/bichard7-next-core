import type { Change } from "diff"
import type Exception from "../../types/Exception"
import type { Trigger } from "../../types/Trigger"
import type PncUpdateRequest from "../../phase3/types/PncUpdateRequest"

export type ComparisonResultDebugOutput = {
  triggers: {
    coreResult: Trigger[]
    comparisonResult: Trigger[]
  }
  exceptions: {
    coreResult: Exception[]
    comparisonResult: Exception[]
  }
  auditLogEvents: {
    coreResult: string[]
    comparisonResult: string[]
  }
  xmlOutputDiff: Change[]
  xmlParsingDiff: Change[]
}

export type Phase3ComparisonResultDebugOutput = ComparisonResultDebugOutput & {
  pncOperations: {
    coreResult: PncUpdateRequest[]
    comparisonResult: PncUpdateRequest[]
  }
}

type ComparisonResultDetail = {
  auditLogEventsMatch: boolean
  triggersMatch: boolean
  exceptionsMatch: boolean
  xmlOutputMatches: boolean
  xmlParsingMatches: boolean
  error?: unknown
  debugOutput?: ComparisonResultDebugOutput
  file?: string
  skipped?: boolean
  correlationId?: string
  intentionalDifference?: boolean
  incomingMessageType?: string
}

export type Phase3ComparisonResultDetail = ComparisonResultDetail & {
  pncOperationsMatch: boolean
  debugOutput?: Phase3ComparisonResultDebugOutput
}

export default ComparisonResultDetail
