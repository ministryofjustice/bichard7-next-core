import type ComparisonResultDetail from "./ComparisonResultDetail"

type ComparisonResult = {
  s3Path: string
  comparisonResult: ComparisonResultDetail
  correlationId?: string
  phase: number
}

export default ComparisonResult
