export default interface ComparisonLog {
  s3Path: string
  initialRunAt: string
  initialResult: number
  latestRunAt: string
  latestResult: number
  skipped?: boolean
  skippedBy?: string
  skippedReason?: string
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
