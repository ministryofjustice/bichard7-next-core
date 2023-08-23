import logger from "phase1/lib/logging"
import type { ComparisonLog, PromiseResult } from "phase1/comparison/types"
import { isError } from "phase1/comparison/types"
import type ComparisonResult from "phase1/comparison/types/ComparisonResult"
import createDynamoDbConfig from "phase1/comparison/lib/createDynamoDbConfig"
import type DynamoGateway from "phase1/comparison/lib/DynamoGateway"
import getDateFromComparisonFilePath from "phase1/comparison/lib/getDateFromComparisonFilePath"
import isPass from "phase1/comparison/lib/isPass"

const { PHASE1_TABLE_NAME, PHASE2_TABLE_NAME, PHASE3_TABLE_NAME } = createDynamoDbConfig()
const dynamoTables = [undefined, PHASE1_TABLE_NAME, PHASE2_TABLE_NAME, PHASE3_TABLE_NAME]

const recordResultsInDynamoBatch = async (
  results: ComparisonResult[],
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

  const promises: PromiseResult<void>[] = []
  const recordsToInsert: { [k: string]: ComparisonLog[] } = {}

  results.forEach((result) => {
    const passOrFail = isPass(result.comparisonResult) ? 1 : 0
    const hasExistingRecord = result.s3Path in logsInDynamoByS3Path
    const runAt = hasExistingRecord
      ? new Date().toISOString()
      : getDateFromComparisonFilePath(result.s3Path).toISOString()

    const record = logsInDynamoByS3Path[result.s3Path] ?? {
      s3Path: result.s3Path,
      correlationId: result.correlationId,
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

    const table = dynamoTables[result.phase] ?? PHASE1_TABLE_NAME

    if (hasExistingRecord) {
      // There's no way to do a batch update in Dynamo, so just do a normal update
      promises.push(dynamoGateway.updateOne(record, "s3Path", record.version, table))
    } else {
      // Group up all of the inserts so that we can do a batch update
      if (!recordsToInsert[table]) {
        recordsToInsert[table] = []
      }
      recordsToInsert[table].push(record)
    }
  })

  Object.entries(recordsToInsert).forEach(([table, records]) => {
    promises.push(dynamoGateway.insertBatch(records, "s3Path", table))
  })

  const dynamoResults = await Promise.all(promises)
  const errors = dynamoResults.filter((res) => isError(res))
  if (errors.length > 0) {
    return errors[0]
  }
}

const recordResultsInDynamo = async (
  results: ComparisonResult[],
  dynamoGateway: DynamoGateway
): PromiseResult<void> => {
  const batchSize = 100
  const promises: PromiseResult<void>[] = []

  for (let i = 0; i < results.length; i += batchSize) {
    promises.push(recordResultsInDynamoBatch(results.slice(i, i + batchSize), dynamoGateway))
  }

  const updateResult = await Promise.all(promises)
  const errors = updateResult.filter((res) => isError(res))
  if (errors.length > 0) {
    logger.error(errors[0])
    return errors[0]
  }
}

export default recordResultsInDynamo
