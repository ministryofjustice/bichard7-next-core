import { DynamoDB } from "aws-sdk"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import type { ComparisonLog, DynamoDbConfig, PromiseResult } from "src/comparison/types"
import { isError } from "src/comparison/types"

export default class DynamoGateway {
  protected readonly service: DynamoDB

  protected readonly client: DocumentClient

  public readonly tableName: string

  constructor(config: DynamoDbConfig) {
    this.tableName = config.TABLE_NAME
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

  insertOne<T>(record: T, keyName: string): PromiseResult<void> {
    const params: DocumentClient.PutItemInput = {
      TableName: this.tableName,
      Item: { _: "_", ...record },
      ConditionExpression: `attribute_not_exists(${keyName})`
    }

    return this.client
      .put(params)
      .promise()
      .then(() => undefined)
      .catch((error) => <Error>error)
  }

  async insertBatch<T>(records: T[], keyName: string): Promise<PromiseResult<void>> {
    const params: DocumentClient.BatchWriteItemInput = {
      RequestItems: {
        [this.tableName]: records.map((record) => ({
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

  updateOne<T>(record: T, keyName: string, version: number): PromiseResult<void> {
    const params: DocumentClient.PutItemInput = {
      TableName: this.tableName,
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

  getOne(keyName: string, keyValue: unknown): PromiseResult<DocumentClient.GetItemOutput | Error | null> {
    return this.client
      .get({
        TableName: this.tableName,
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

  async *getRange(
    start: string,
    end: string,
    success?: boolean,
    batchSize = 1000,
    includeSkipped = false
  ): AsyncIterableIterator<ComparisonLog[] | Error> {
    let ExclusiveStartKey: DynamoDB.DocumentClient.Key | undefined

    let failureFilter = {}
    let failureValue = {}
    if (success !== undefined) {
      failureFilter = { FilterExpression: "latestResult = :latestResultValue" }
      failureValue = { ":latestResultValue": success ? 1 : 0 }
    }

    while (true) {
      const query = {
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

      const result = await this.client
        .query(query)
        .promise()
        .catch((error: Error) => error)

      if (isError(result)) {
        yield result
        break
      }

      if (result.Items) {
        if (includeSkipped) {
          yield result.Items as ComparisonLog[]
        } else {
          yield result.Items.filter((item) => !item.skipped) as ComparisonLog[]
        }

        if (result.LastEvaluatedKey) {
          ExclusiveStartKey = result.LastEvaluatedKey
        } else {
          break
        }
      } else {
        break
      }
    }
  }

  async *getAllFailures(batchSize = 1000, includeSkipped = false): AsyncIterableIterator<ComparisonLog[] | Error> {
    let ExclusiveStartKey: DynamoDB.DocumentClient.Key | undefined

    while (true) {
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
        yield result
        break
      }

      if (result.Items) {
        if (includeSkipped) {
          yield result.Items as ComparisonLog[]
        } else {
          yield result.Items.filter((item) => !item.skipped) as ComparisonLog[]
        }

        if (result.LastEvaluatedKey) {
          ExclusiveStartKey = result.LastEvaluatedKey
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

  async *getAll(batchSize = 1000, includeSkipped = false): AsyncIterableIterator<ComparisonLog[] | Error> {
    for await (const batch of this.getRange("0", "3000", undefined, batchSize, includeSkipped)) {
      yield batch
    }
  }
}
