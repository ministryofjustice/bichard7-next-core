import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import getFileFromS3 from "@moj-bichard7/common/s3/getFileFromS3"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import getStandingDataVersionByDate from "phase1/comparison/cli/getStandingDataVersionByDate"
import { isPhase1 } from "phase1/comparison/lib/checkPhase"
import comparePhase1 from "phase1/comparison/lib/comparePhase1"
import getDateFromComparisonFilePath from "phase1/comparison/lib/getDateFromComparisonFilePath"
import type ComparisonResult from "phase1/comparison/types/ComparisonResult"
import type ComparisonResultDetail from "phase1/comparison/types/ComparisonResultDetail"
import { parseComparisonFile } from "phase1/tests/helpers/processTestFile"

const failResult: ComparisonResultDetail = {
  triggersMatch: false,
  exceptionsMatch: false,
  xmlOutputMatches: false,
  xmlParsingMatches: false
}

const s3Config = createS3Config()

const compareFile = async (s3Path: string, bucket: string): PromiseResult<ComparisonResult> => {
  const content = await getFileFromS3(s3Path, bucket, s3Config)
  if (content instanceof Error) {
    return content
  }

  const comparison = parseComparisonFile(content)
  const correlationId = "correlationId" in comparison ? comparison.correlationId : undefined
  const phase = "phase" in comparison ? comparison.phase : 1
  let comparisonResult: ComparisonResultDetail = failResult
  const date = getDateFromComparisonFilePath(s3Path)
  try {
    if (isPhase1(comparison)) {
      comparisonResult = await comparePhase1(comparison, false, {
        defaultStandingDataVersion: getStandingDataVersionByDate(date)
      })
    }
  } catch (e) {
    return e as Error
  }

  return { s3Path, phase, correlationId, comparisonResult }
}

export default compareFile
