import { DynamoDB } from "aws-sdk"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import type { DynamoDbConfig, PromiseResult } from "src/comparison/Types"

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
}
