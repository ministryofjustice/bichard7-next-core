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
  pncOperations?: {
    coreResult: PncUpdateRequest[]
    comparisonResult: PncUpdateRequest[]
  }
  auditLogEvents: {
    coreResult: string[]
    comparisonResult: string[]
  }
  xmlOutputDiff: Change[]
  xmlParsingDiff: Change[]
}

type ComparisonResultDetail = {
  auditLogEventsMatch: boolean
  triggersMatch: boolean
  exceptionsMatch: boolean
  pncOperationsMatch?: boolean
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

export default ComparisonResultDetail
