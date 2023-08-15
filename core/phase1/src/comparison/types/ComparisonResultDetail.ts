import type Exception from "core/phase1/src/types/Exception"
import type { Trigger } from "core/phase1/src/types/Trigger"
import type { Change } from "diff"

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
