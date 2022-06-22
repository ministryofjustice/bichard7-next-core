import type { ComparisonResult } from "./compare"
import type DynamoGateway from "./DynamoGateway/DynamoGateway"
import type { PromiseResult } from "./Types"
import { isError } from "./Types"

const logInDynamoDb = async (
  s3Path: string,
  comparisonResult: ComparisonResult,
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

  const date = new Date()
  const record = getOneResult?.Item ?? {
    s3Path,
    initialRunAt: date.toISOString(),
    initialResult: latestResult,
    history: [],
    version: 1
  }

  record.latestRunAt = date.toISOString()
  record.latestResult = latestResult

  record.history.push({
    runAt: date.toISOString(),
    result: record.latestResult,
    details: {
      triggersMatch: comparisonResult.triggersMatch ? 1 : 0,
      exceptionsMatch: comparisonResult.exceptionsMatch ? 1 : 0,
      xmlOutputMatches: comparisonResult.xmlOutputMatches ? 1 : 0,
      xmlParsingMatches: comparisonResult.xmlParsingMatches ? 1 : 0
    }
  })

  return getOneResult?.Item
    ? dynamoGateway.updateOne(record, "s3Path", record.version)
    : dynamoGateway.insertOne(record, "s3Path")
}

export default logInDynamoDb
