import { DynamoDB } from "aws-sdk"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import type { ComparisonLog, DynamoDbConfig, PromiseResult } from "src/comparison/types"
import { isError } from "src/comparison/types"

export default class DynamoGateway {
  protected readonly service: DynamoDB

  protected readonly client: DocumentClient

  private readonly tableName: string

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

  async *getRange(
    start: string,
    end: string,
    success?: boolean,
    batchSize = 1000
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

      if (result.Items && result.Items.length > 0) {
        yield result.Items as ComparisonLog[]

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

  async *getFailures(batchSize = 1000): AsyncIterableIterator<ComparisonLog[] | Error> {
    for await (const batch of this.getRange("0", "3000", false, batchSize)) {
      yield batch
    }
  }

  async *getAll(batchSize = 1000): AsyncIterableIterator<ComparisonLog[] | Error> {
    for await (const batch of this.getRange("0", "3000", undefined, batchSize)) {
      yield batch
    }
  }
}
