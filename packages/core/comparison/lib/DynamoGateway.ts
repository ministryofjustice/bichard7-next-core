import type { PromiseResult } from "@moj-bichard7/common/types/Result"

import { isError } from "@moj-bichard7/common/types/Result"
import { DynamoDB } from "aws-sdk"
import { DocumentClient } from "aws-sdk/clients/dynamodb"

import type { ComparisonLog, DynamoDbConfig } from "../types"

type GetRangePageOptions = {
  batchSize?: number
  columns?: string[]
  exclusiveStartKey?: DynamoDB.DocumentClient.Key
  includeSkipped?: boolean
  success?: boolean
}

type ResultPage<T> = {
  lastEvaluatedKey?: DynamoDB.DocumentClient.Key
  records: T[]
}

export default class DynamoGateway {
  protected readonly client: DocumentClient

  protected readonly service: DynamoDB

  public readonly tableName: string

  constructor(config: DynamoDbConfig) {
    this.tableName = config.TABLE_NAME
    const conf: DynamoDB.ClientConfiguration = {
      accessKeyId: config.AWS_ACCESS_KEY_ID,
      endpoint: config.DYNAMO_URL,
      region: config.DYNAMO_REGION,
      secretAccessKey: config.AWS_SECRET_ACCESS_KEY
    }

    this.service = new DynamoDB(conf)
    this.client = new DocumentClient({
      service: this.service
    })
  }

  async *getAll(
    batchSize = 1000,
    includeSkipped = false,
    columns: string[] = []
  ): AsyncIterableIterator<ComparisonLog[] | Error> {
    for await (const batch of this.getRange("0", "3000", undefined, batchSize, includeSkipped, columns)) {
      yield batch
    }
  }

  async *getAllFailures(batchSize = 1000, includeSkipped = false): AsyncIterableIterator<ComparisonLog[] | Error> {
    let ExclusiveStartKey: DynamoDB.DocumentClient.Key | undefined

    while (true) {
      const result = await this.getAllFailuresPage(batchSize, includeSkipped, ExclusiveStartKey)

      if (isError(result)) {
        yield result
        break
      }

      if (result.records.length > 0) {
        if (includeSkipped) {
          yield result.records as ComparisonLog[]
        } else {
          yield result.records.filter((record) => !record.skipped) as ComparisonLog[]
        }

        if (result.lastEvaluatedKey) {
          ExclusiveStartKey = result.lastEvaluatedKey
        } else {
          break
        }
      } else {
        break
      }
    }
  }

  async getAllFailuresPage(
    batchSize = 1000,
    includeSkipped = false,
    ExclusiveStartKey?: DynamoDB.DocumentClient.Key
  ): PromiseResult<ResultPage<ComparisonLog>> {
    const query = {
      ExpressionAttributeNames: {
        "#partitionKey": "_"
      },
      ExpressionAttributeValues: {
        ":latestResultValue": 0,
        ":partitionKeyValue": "_",
        ":skippedValue": true
      },
      FilterExpression: "skipped <> :skippedValue",
      IndexName: "latestResultIndex",
      KeyConditionExpression: "#partitionKey = :partitionKeyValue and latestResult = :latestResultValue",
      Limit: batchSize,
      TableName: this.tableName,
      ...(ExclusiveStartKey ? { ExclusiveStartKey } : {})
    }

    const result = await this.client
      .query(query)
      .promise()
      .catch((error: Error) => error)

    if (isError(result)) {
      return result
    }

    if (result.Items) {
      if (includeSkipped) {
        return { lastEvaluatedKey: result.LastEvaluatedKey, records: result.Items as ComparisonLog[] }
      } else {
        return {
          lastEvaluatedKey: result.LastEvaluatedKey,
          records: result.Items.filter((item) => !item.skipped) as ComparisonLog[]
        }
      }
    }

    return {
      lastEvaluatedKey: result.LastEvaluatedKey,
      records: []
    }
  }

  getBatch(keyName: string, keyValues: unknown[]): PromiseResult<DocumentClient.BatchGetItemOutput | Error | null> {
    return this.client
      .batchGet({
        RequestItems: {
          [this.tableName]: {
            Keys: keyValues.map((kv) => ({ [keyName]: kv }))
          }
        }
      })
      .promise()
      .catch((error) => <Error>error)
  }

  async *getFailures(batchSize = 1000, includeSkipped = false): AsyncIterableIterator<ComparisonLog[] | Error> {
    let buffer: ComparisonLog[] = []
    for await (const batch of this.getRange("0", "3000", false, batchSize, includeSkipped)) {
      if (isError(batch)) {
        return batch
      }

      buffer = buffer.concat(batch)
      if (buffer.length >= batchSize) {
        yield buffer.slice(0, batchSize)
        buffer = buffer.slice(batchSize)
      }
    }

    yield buffer
  }

  getOne(
    keyName: string,
    keyValue: unknown,
    tableName?: string
  ): PromiseResult<DocumentClient.GetItemOutput | Error | null> {
    return this.client
      .get({
        Key: {
          [keyName]: keyValue
        },
        TableName: tableName ?? this.tableName
      })
      .promise()
      .catch((error) => <Error>error)
  }

  async *getRange(
    start: Date | string,
    end: Date | string,
    success?: boolean,
    batchSize = 1000,
    includeSkipped = false,
    columns: string[] = []
  ): AsyncIterableIterator<ComparisonLog[] | Error> {
    let exclusiveStartKey: DynamoDB.DocumentClient.Key | undefined

    while (true) {
      const result = await this.getRangePage(start, end, {
        batchSize,
        columns,
        exclusiveStartKey,
        includeSkipped,
        success
      })

      if (isError(result)) {
        yield result
        break
      }

      yield includeSkipped ? result.records : result.records.filter((record) => !record.skipped)

      if (!result.lastEvaluatedKey) {
        break
      }

      exclusiveStartKey = result.lastEvaluatedKey
    }
  }

  async getRangePage(
    start: Date | string,
    end: Date | string,
    options?: GetRangePageOptions
  ): PromiseResult<ResultPage<ComparisonLog>> {
    const success = options?.success
    const batchSize = options?.batchSize ?? 1000
    const includeSkipped = options?.includeSkipped ?? false
    const columns = options?.columns ?? []
    const ExclusiveStartKey = options?.exclusiveStartKey

    let failureFilter = {}
    let failureValue = {}
    if (success !== undefined) {
      failureFilter = { FilterExpression: "latestResult = :latestResultValue" }
      failureValue = { ":latestResultValue": success ? 1 : 0 }
    }

    const query: DynamoDB.DocumentClient.QueryInput = {
      ExpressionAttributeNames: {
        "#partitionKey": "_"
      },
      ExpressionAttributeValues: {
        ":end": new Date(end).toISOString(),
        ":partitionKeyValue": "_",
        ":start": new Date(start).toISOString(),
        ...failureValue
      },
      IndexName: "initialRunAtIndex",
      KeyConditionExpression: "#partitionKey = :partitionKeyValue and initialRunAt between :start and :end",
      TableName: this.tableName,
      ...failureFilter,
      Limit: batchSize,
      ...(ExclusiveStartKey ? { ExclusiveStartKey } : {})
    }

    if (columns.length > 0) {
      query.ProjectionExpression = columns.join(",")
    }

    const result = await this.client
      .query(query)
      .promise()
      .catch((error: Error) => error)

    if (isError(result)) {
      return result
    }

    if (result.Items) {
      if (includeSkipped) {
        return {
          lastEvaluatedKey: result.LastEvaluatedKey,
          records: result.Items as ComparisonLog[]
        }
      } else {
        return {
          lastEvaluatedKey: result.LastEvaluatedKey,
          records: result.Items.filter((item) => !item.skipped) as ComparisonLog[]
        }
      }
    }

    return {
      lastEvaluatedKey: result.LastEvaluatedKey,
      records: []
    }
  }

  async insertBatch<T>(records: T[], keyName: string, tableName?: string): PromiseResult<void> {
    const params: DocumentClient.BatchWriteItemInput = {
      RequestItems: {
        [tableName ?? this.tableName]: records.map((record) => ({
          PutRequest: {
            ConditionExpression: `attribute_not_exists(${keyName})`,
            Item: { _: "_", ...record }
          }
        }))
      }
    }

    const result = await this.client
      .batchWrite(params)
      .promise()
      .catch((error) => <Error>error)

    if (isError(result)) {
      return result
    }

    while (result.UnprocessedItems && Object.keys(result.UnprocessedItems).length > 0) {
      const nextResult = await this.client
        .batchWrite({
          RequestItems: result.UnprocessedItems
        })
        .promise()
        .catch((error) => <Error>error)

      if (isError(nextResult)) {
        return nextResult
      }
    }
  }

  insertOne<T>(record: T, keyName: string, tableName?: string): PromiseResult<void> {
    const params: DocumentClient.PutItemInput = {
      ConditionExpression: `attribute_not_exists(${keyName})`,
      Item: { _: "_", ...record },
      TableName: tableName ?? this.tableName
    }

    return this.client
      .put(params)
      .promise()
      .then(() => undefined)
      .catch((error) => <Error>error)
  }

  updateOne<T>(record: T, keyName: string, version: number, tableName?: string): PromiseResult<void> {
    const params: DocumentClient.PutItemInput = {
      ConditionExpression: `attribute_exists(${keyName}) and version = :version`,
      ExpressionAttributeValues: {
        ":version": version
      },
      Item: { _: "_", ...record, version: version + 1 },
      TableName: tableName ?? this.tableName
    }

    return this.client
      .put(params)
      .promise()
      .then(() => undefined)
      .catch((error) => <Error>error)
  }
}
