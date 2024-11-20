import type ComparisonResultDetail from "./ComparisonResultDetail"

type ComparisonResult = {
  comparisonResult: ComparisonResultDetail
  correlationId?: string
  phase: number
  s3Path: string
}

export default ComparisonResult
