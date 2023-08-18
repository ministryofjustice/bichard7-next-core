import type { Change } from "diff"
import type Exception from "phase1/types/Exception"
import type { Trigger } from "phase1/types/Trigger"

export type ComparisonResultDebugOutput = {
  triggers: {
    coreResult: Trigger[]
    comparisonResult: Trigger[]
  }
  exceptions: {
    coreResult: Exception[]
    comparisonResult: Exception[]
  }
  xmlOutputDiff: Change[]
  xmlParsingDiff: Change[]
}

type ComparisonResultDetail = {
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
}

export default ComparisonResultDetail
