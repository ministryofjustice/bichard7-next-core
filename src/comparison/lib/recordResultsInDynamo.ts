import type { ComparisonLog, PromiseResult } from "../types"
import { isError } from "../types"
import type { ComparisonResult } from "./compareMessage"
import type DynamoGateway from "./DynamoGateway"
import getDateFromComparisonFilePath from "./getDateFromComparisonFilePath"

type DynamoResult = {
  s3Path: string
  comparisonResult: ComparisonResult
}

const isPass = (result: ComparisonResult): boolean =>
  result.triggersMatch && result.exceptionsMatch && result.xmlOutputMatches && result.xmlParsingMatches

const recordResultsInDynamoBatch = async (
  results: DynamoResult[],
  dynamoGateway: DynamoGateway
): PromiseResult<void> => {
  const s3Paths = results.map((result) => result.s3Path)
  const getBatchResult = await dynamoGateway.getBatch("s3Path", s3Paths)

  if (isError(getBatchResult)) {
    return getBatchResult
  }

  const logsInDynamo = (
    getBatchResult?.Responses ? getBatchResult.Responses[dynamoGateway.tableName] : []
  ) as ComparisonLog[]

  const logsInDynamoByS3Path = logsInDynamo.reduce((acc: { [key: string]: ComparisonLog }, log) => {
    acc[log.s3Path] = log
    return acc
  }, {})

  const promises = []
  const recordsToInsert: ComparisonLog[] = []

  results.forEach((result) => {
    const passOrFail = isPass(result.comparisonResult) ? 1 : 0
    const hasExistingRecord = result.s3Path in logsInDynamoByS3Path
    const runAt = hasExistingRecord
      ? new Date().toISOString()
      : getDateFromComparisonFilePath(result.s3Path).toISOString()

    const record = logsInDynamoByS3Path[result.s3Path] ?? {
      s3Path: result.s3Path,
      initialRunAt: runAt,
      initialResult: passOrFail,
      history: [],
      version: 1
    }

    record.latestRunAt = runAt
    record.latestResult = passOrFail

    record.history.push({
      runAt: runAt,
      result: passOrFail,
      details: {
        triggersMatch: result.comparisonResult.triggersMatch ? 1 : 0,
        exceptionsMatch: result.comparisonResult.exceptionsMatch ? 1 : 0,
        xmlOutputMatches: result.comparisonResult.xmlOutputMatches ? 1 : 0,
        xmlParsingMatches: result.comparisonResult.xmlParsingMatches ? 1 : 0
      }
    })

    if (hasExistingRecord) {
      // There's no way to do a batch update in Dynamo, so just do a normal update
      promises.push(dynamoGateway.updateOne(record, "s3Path", record.version))
    } else {
      // Group up all of the inserts so that we can do a batch update
      recordsToInsert.push(record)
    }
  })

  promises.push(dynamoGateway.insertBatch(recordsToInsert, "s3Path"))
  await Promise.all(promises)
}

const recordResultsInDynamo = async (results: DynamoResult[], dynamoGateway: DynamoGateway): PromiseResult<void> => {
  const batchSize = 100
  const promises: PromiseResult<void>[] = []

  for (let i = 0; i < results.length; i += batchSize) {
    promises.push(recordResultsInDynamoBatch(results.slice(i, i + batchSize), dynamoGateway))
  }

  await Promise.all(promises)
}

export default recordResultsInDynamo
