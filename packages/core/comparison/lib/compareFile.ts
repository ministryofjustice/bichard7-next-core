import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import getFileFromS3 from "@moj-bichard7/common/s3/getFileFromS3"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import getStandingDataVersionByDate from "../cli/getStandingDataVersionByDate"
import type ComparisonResult from "../types/ComparisonResult"
import type ComparisonResultDetail from "../types/ComparisonResultDetail"
import { isPhase1, isPhase2 } from "./checkPhase"
import comparePhase1 from "./comparePhase1"
import getDateFromComparisonFilePath from "./getDateFromComparisonFilePath"
import { parseComparisonFile } from "./processTestFile"
import comparePhase2 from "./comparePhase2"

const failResult: ComparisonResultDetail = {
  triggersMatch: false,
  exceptionsMatch: false,
  xmlOutputMatches: false,
  xmlParsingMatches: false
}

const s3Config = createS3Config()

const compareFile = async (s3Path: string, bucket: string): PromiseResult<ComparisonResult> => {
  const content = await getFileFromS3(s3Path, bucket, s3Config)
  console.log("Got file from s3....")
  if (content instanceof Error) {
    return content
  }
  console.log("Starting comparison....")

  const comparison = parseComparisonFile(content)
  const correlationId = "correlationId" in comparison ? comparison.correlationId : undefined
  const phase = "phase" in comparison ? comparison.phase : 1
  let comparisonResult: ComparisonResultDetail = failResult
  const date = getDateFromComparisonFilePath(s3Path)
  try {
    if (isPhase1(comparison)) {
      console.log("Phase 1 comparison....")
      comparisonResult = await comparePhase1(comparison, false, {
        defaultStandingDataVersion: getStandingDataVersionByDate(date)
      })
    } else if (isPhase2(comparison)) {
      console.log("Phase 2 comparison....")
      comparisonResult = comparePhase2(comparison, false)
    }
  } catch (e) {
    return e as Error
  }

  return { s3Path, phase, correlationId, comparisonResult }
}

export default compareFile
