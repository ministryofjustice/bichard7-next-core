import createS3Config from "src/lib/createS3Config"
import getFileFromS3 from "src/lib/getFileFromS3"
import { parseComparisonFile } from "tests/helpers/processTestFile"
import getStandingDataVersionByDate from "../cli/getStandingDataVersionByDate"
import type { PromiseResult } from "../types"
import type ComparisonResult from "../types/ComparisonResult"
import type ComparisonResultDetail from "../types/ComparisonResultDetail"
import { isPhase1 } from "./checkPhase"
import comparePhase1 from "./comparePhase1"
import getDateFromComparisonFilePath from "./getDateFromComparisonFilePath"

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
