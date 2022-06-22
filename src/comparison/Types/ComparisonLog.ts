export default interface ComparisonLog {
  s3Path: string
  initialRunAt: string
  initialResult: number
  latestRunAt: string
  latestResult: number
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
