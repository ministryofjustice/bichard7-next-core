export default interface ComparisonLog {
  version: number
  s3Path: string
  initialRunAt: string
  initialResult: number
  latestRunAt: string
  latestResult: number
  skipped?: boolean
  skippedBy?: string
  skippedReason?: string
  intentionalDifference?: boolean
  history: [
    {
      runAt: string
      result: number
      details: {
        triggersMatch: number
        exceptionsMatch: number
        xmlOutputMatches: number
        xmlParsingMatches: number
      }
    }
  ]
}
