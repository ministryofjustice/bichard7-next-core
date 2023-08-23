import type ComparisonResultDetail from "phase1/comparison/types/ComparisonResultDetail"

type ComparisonResult = {
  s3Path: string
  comparisonResult: ComparisonResultDetail
  correlationId?: string
  phase: number
}

export default ComparisonResult
