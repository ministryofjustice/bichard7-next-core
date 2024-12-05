export default interface ComparisonLog {
  history: [
    {
      details: {
        auditLogEventsMatch: number
        exceptionsMatch: number
        triggersMatch: number
        xmlOutputMatches: number
        xmlParsingMatches: number
      }
      result: number
      runAt: string
    }
  ]
  initialResult: number
  initialRunAt: string
  intentionalDifference?: boolean
  latestResult: number
  latestRunAt: string
  s3Path: string
  skipped?: boolean
  skippedBy?: string
  skippedReason?: string
  version: number
}
