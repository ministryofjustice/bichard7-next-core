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
  pncOperations?: {
    comparisonResult: PncUpdateRequest[]
    coreResult: PncUpdateRequest[]
  }
  triggers: {
    comparisonResult: Trigger[]
    coreResult: Trigger[]
  }
  xmlOutputDiff: Change[]
  xmlParsingDiff: Change[]
}

type ComparisonResultDetail = {
  auditLogEventsMatch: boolean
  correlationId?: string
  debugOutput?: ComparisonResultDebugOutput
  error?: unknown
  exceptionsMatch: boolean
  file?: string
  incomingMessageType?: string
  intentionalDifference?: boolean
  pncOperationsMatch?: boolean
  skipped?: boolean
  triggersMatch: boolean
  xmlOutputMatches: boolean
  xmlParsingMatches: boolean
}

export default ComparisonResultDetail
