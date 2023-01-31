import { DynamoDB } from "aws-sdk"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import type { ComparisonLog, DynamoDbConfig, PromiseResult } from "src/comparison/types"
import { isError } from "src/comparison/types"

type GetRangePageOptions = {
  batchSize?: number
  columns?: string[]
  exclusiveStartKey?: DynamoDB.DocumentClient.Key
  includeSkipped?: boolean
  success?: boolean
}

type ResultPage<T> = {
  records: T[]
  lastEvaluatedKey?: DynamoDB.DocumentClient.Key
}

export default class DynamoGateway {
  protected readonly service: DynamoDB

  protected readonly client: DocumentClient

  public readonly tableName: string

  constructor(config: DynamoDbConfig) {
    this.tableName = config.PHASE1_TABLE_NAME
    const conf: DynamoDB.ClientConfiguration = {
      endpoint: config.DYNAMO_URL,
      region: config.DYNAMO_REGION,
      accessKeyId: config.AWS_ACCESS_KEY_ID,
      secretAccessKey: config.AWS_SECRET_ACCESS_KEY
    }

    this.service = new DynamoDB(conf)
    this.client = new DocumentClient({
      service: this.service
    })
  }

  insertOne<T>(record: T, keyName: string, tableName?: string): PromiseResult<void> {
    const params: DocumentClient.PutItemInput = {
      TableName: tableName ?? this.tableName,
      Item: { _: "_", ...record },
      ConditionExpression: `attribute_not_exists(${keyName})`
    }

    return this.client
      .put(params)
      .promise()
      .then(() => undefined)
      .catch((error) => <Error>error)
  }

  async insertBatch<T>(records: T[], keyName: string, tableName?: string): PromiseResult<void> {
    const params: DocumentClient.BatchWriteItemInput = {
      RequestItems: {
        [tableName ?? this.tableName]: records.map((record) => ({
          PutRequest: {
            Item: { _: "_", ...record },
            ConditionExpression: `attribute_not_exists(${keyName})`
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

  updateOne<T>(record: T, keyName: string, version: number, tableName?: string): PromiseResult<void> {
    const params: DocumentClient.PutItemInput = {
      TableName: tableName ?? this.tableName,
      Item: { _: "_", ...record, version: version + 1 },
      ConditionExpression: `attribute_exists(${keyName}) and version = :version`,
      ExpressionAttributeValues: {
        ":version": version
      }
    }

    return this.client
      .put(params)
      .promise()
      .then(() => undefined)
      .catch((error) => <Error>error)
  }

  getOne(
    keyName: string,
    keyValue: unknown,
    tableName?: string
  ): PromiseResult<DocumentClient.GetItemOutput | Error | null> {
    return this.client
      .get({
        TableName: tableName ?? this.tableName,
        Key: {
          [keyName]: keyValue
        }
      })
      .promise()
      .catch((error) => <Error>error)
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

  async getRangePage(
    start: string,
    end: string,
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
      TableName: this.tableName,
      IndexName: "initialRunAtIndex",
      KeyConditionExpression: "#partitionKey = :partitionKeyValue and initialRunAt between :start and :end",
      ExpressionAttributeNames: {
        "#partitionKey": "_"
      },
      ExpressionAttributeValues: {
        ":start": start,
        ":end": end,
        ":partitionKeyValue": "_",
        ...failureValue
      },
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
          records: result.Items as ComparisonLog[],
          lastEvaluatedKey: result.LastEvaluatedKey
        }
      } else {
        return {
          records: result.Items.filter((item) => !item.skipped) as ComparisonLog[],
          lastEvaluatedKey: result.LastEvaluatedKey
        }
      }
    }

    return {
      records: [],
      lastEvaluatedKey: result.LastEvaluatedKey
    }
  }

  async *getRange(
    start: string,
    end: string,
    success?: boolean,
    batchSize = 1000,
    includeSkipped = false,
    columns: string[] = []
  ): AsyncIterableIterator<ComparisonLog[] | Error> {
    let exclusiveStartKey: DynamoDB.DocumentClient.Key | undefined

    while (true) {
      const result = await this.getRangePage(start, end, {
        success,
        batchSize,
        includeSkipped,
        columns,
        exclusiveStartKey
      })

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
          exclusiveStartKey = result.lastEvaluatedKey
        } else {
          break
        }
      } else {
        yield []
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
      TableName: this.tableName,
      IndexName: "latestResultIndex",
      KeyConditionExpression: "#partitionKey = :partitionKeyValue and latestResult = :latestResultValue",
      FilterExpression: "skipped <> :skippedValue",
      ExpressionAttributeNames: {
        "#partitionKey": "_"
      },
      ExpressionAttributeValues: {
        ":partitionKeyValue": "_",
        ":latestResultValue": 0,
        ":skippedValue": true
      },
      Limit: batchSize,
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
        return { records: result.Items as ComparisonLog[], lastEvaluatedKey: result.LastEvaluatedKey }
      } else {
        return {
          records: result.Items.filter((item) => !item.skipped) as ComparisonLog[],
          lastEvaluatedKey: result.LastEvaluatedKey
        }
      }
    }

    return {
      records: [],
      lastEvaluatedKey: result.LastEvaluatedKey
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

  async *getAll(
    batchSize = 1000,
    includeSkipped = false,
    columns: string[] = []
  ): AsyncIterableIterator<ComparisonLog[] | Error> {
    for await (const batch of this.getRange("0", "3000", undefined, batchSize, includeSkipped, columns)) {
      yield batch
    }
  }
}
