import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import { isError } from "@moj-bichard7/common/types/Result"
import type ComparisonResultDetail from "../types/ComparisonResultDetail"
import type DynamoGateway from "./DynamoGateway"
import createDynamoDbConfig from "./createDynamoDbConfig"
import getDateFromComparisonFilePath from "./getDateFromComparisonFilePath"

const { PHASE1_TABLE_NAME, PHASE2_TABLE_NAME, PHASE3_TABLE_NAME } = createDynamoDbConfig()
const dynamoTables = [undefined, PHASE1_TABLE_NAME, PHASE2_TABLE_NAME, PHASE3_TABLE_NAME]

const recordResultInDynamo = async (
  s3Path: string,
  comparisonResult: ComparisonResultDetail,
  phase: number,
  correlationId: string | undefined,
  dynamoGateway: DynamoGateway
): PromiseResult<void> => {
  const latestResult =
    comparisonResult.triggersMatch &&
    comparisonResult.exceptionsMatch &&
    comparisonResult.xmlOutputMatches &&
    comparisonResult.xmlParsingMatches
      ? 1
      : 0

  const getOneResult = await dynamoGateway.getOne("s3Path", s3Path)

  if (isError(getOneResult)) {
    return getOneResult
  }

  const initialDate = getDateFromComparisonFilePath(s3Path).toISOString()
  const date = new Date().toISOString()

  const record = getOneResult?.Item ?? {
    s3Path,
    initialRunAt: initialDate,
    initialResult: latestResult,
    history: [],
    version: 1,
    correlationId
  }

  record.latestRunAt = date
  record.latestResult = latestResult

  record.history.push({
    runAt: getOneResult?.Item ? date : initialDate,
    result: record.latestResult,
    details: {
      triggersMatch: comparisonResult.triggersMatch ? 1 : 0,
      exceptionsMatch: comparisonResult.exceptionsMatch ? 1 : 0,
      xmlOutputMatches: comparisonResult.xmlOutputMatches ? 1 : 0,
      xmlParsingMatches: comparisonResult.xmlParsingMatches ? 1 : 0
    }
  })

  const table = dynamoTables[phase]

  return getOneResult?.Item
    ? dynamoGateway.updateOne(record, "s3Path", record.version, table)
    : dynamoGateway.insertOne(record, "s3Path", table)
}

export default recordResultInDynamo
