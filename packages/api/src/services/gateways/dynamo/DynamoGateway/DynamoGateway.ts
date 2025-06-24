import type {
  GetCommandOutput,
  PutCommandInput,
  TransactWriteCommandInput,
  UpdateCommandInput,
  UpdateCommandOutput
} from "@aws-sdk/lib-dynamodb"

import { DynamoDBClient, TransactionCanceledException } from "@aws-sdk/client-dynamodb"
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  type QueryCommandInput,
  type QueryCommandOutput,
  TransactWriteCommand,
  UpdateCommand
} from "@aws-sdk/lib-dynamodb"
import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import type TransactionFailureReason from "../../../../types/TransactionFailureReason"
import type DynamoDbConfig from "./DynamoDbConfig"
import type DynamoUpdate from "./DynamoUpdate"
import type FetchByIndexOptions from "./FetchByIndexOptions"
import type GetManyOptions from "./GetManyOptions"
import type UpdateOptions from "./UpdateOptions"

import TransactionFailedError from "../../../../types/errors/TransactionFailedError"
import KeyComparison from "./KeyComparison"

export type Projection = {
  attributeNames: {
    [key: string]: string
  }
  expression: string
}

export default class DynamoGateway {
  protected readonly client: DynamoDBDocumentClient

  protected readonly service: DynamoDBClient

  constructor(config: DynamoDbConfig) {
    this.service = new DynamoDBClient(config)
    this.client = DynamoDBDocumentClient.from(this.service)
  }
  async deleteMany(tableName: string, keyName: string, keyValues: string[]): PromiseResult<void> {
    for (const keyValue of keyValues) {
      try {
        await this.client.send(
          new DeleteCommand({
            Key: {
              [keyName]: keyValue
            },
            TableName: tableName
          })
        )
      } catch (error) {
        return <Error>error
      }
    }

    return undefined
  }

  async executeTransaction(actions: DynamoUpdate[]): PromiseResult<void> {
    let failureReasons: TransactionFailureReason[] = []

    const result = await this.client
      .send(
        new TransactWriteCommand({
          TransactItems: actions
        })
      )
      .catch((error: Error) => error)
    if (!isError(result)) {
      return undefined
    }

    if (result.name === "TransactionCanceledException" && result instanceof TransactionCanceledException) {
      try {
        const cancellationReasons = result.CancellationReasons as TransactionFailureReason[] | undefined

        if (cancellationReasons && cancellationReasons.length > 0) {
          failureReasons = cancellationReasons
        } else {
          failureReasons = [
            {
              Code: "UnknownError",
              Message: result.message ?? "Unknown transaction failure"
            }
          ]
        }
      } catch (parseError) {
        console.error("Error parsing cancellation reasons:", parseError)
        failureReasons = [
          {
            Code: "UnknownError",
            Message: result.message ?? "Unknown transaction failure"
          }
        ]
      }

      return new TransactionFailedError(failureReasons, result.message ?? "Transaction failed")
    }

    return result
  }

  async fetchByIndex(tableName: string, options: FetchByIndexOptions): PromiseResult<QueryCommandOutput> {
    const {
      hashKeyName: attributeName,
      hashKeyValue: attributeValue,
      indexName,
      isAscendingOrder,
      projection
    } = options
    const { lastItemKey, limit } = options.pagination

    const { attributeNames, expression } = projection ?? {}

    const queryOptions: QueryCommandInput = {
      ExclusiveStartKey: lastItemKey,
      ExpressionAttributeNames: {
        "#keyName": attributeName,
        ...attributeNames
      },
      ExpressionAttributeValues: {
        ":keyValue": attributeValue
      },
      IndexName: indexName,
      KeyConditionExpression: "#keyName = :keyValue",
      Limit: limit,
      ProjectionExpression: expression,
      ScanIndexForward: isAscendingOrder,
      TableName: tableName
    }

    // set query options for comparison to a range key value
    if (options.rangeKeyName && options.rangeKeyValue !== undefined && options.rangeKeyComparison !== undefined) {
      if (options.rangeKeyComparison == KeyComparison.LessThanOrEqual) {
        queryOptions.KeyConditionExpression += " AND #rangeKeyName <= :rangeKeyValue"
        queryOptions.ExpressionAttributeNames!["#rangeKeyName"] = options.rangeKeyName
        queryOptions.ExpressionAttributeValues![":rangeKeyValue"] = options.rangeKeyValue
      }

      if (options.rangeKeyComparison == KeyComparison.Equals) {
        queryOptions.KeyConditionExpression += " AND #rangeKeyName = :rangeKeyValue"
        queryOptions.ExpressionAttributeNames!["#rangeKeyName"] = options.rangeKeyName
        queryOptions.ExpressionAttributeValues![":rangeKeyValue"] = options.rangeKeyValue
      }
    }

    // set query options for between range key
    if (options.rangeKeyName && options.betweenKeyStart !== undefined && options.betweenKeyEnd !== undefined) {
      queryOptions.KeyConditionExpression += " AND #rangeKeyName BETWEEN :betweenKeyStart AND :betweenKeyEnd"
      queryOptions.ExpressionAttributeNames!["#rangeKeyName"] = options.rangeKeyName
      queryOptions.ExpressionAttributeValues![":betweenKeyStart"] = options.betweenKeyStart
      queryOptions.ExpressionAttributeValues![":betweenKeyEnd"] = options.betweenKeyEnd
    }

    // set query options for the filter if given
    if (options.filterKeyName && options.filterKeyValue !== undefined && options.filterKeyComparison !== undefined) {
      if (options.filterKeyComparison == KeyComparison.LessThanOrEqual) {
        queryOptions.FilterExpression = "#filterKeyName <= :filterKeyValue"
        queryOptions.ExpressionAttributeNames!["#filterKeyName"] = options.filterKeyName
        queryOptions.ExpressionAttributeValues![":filterKeyValue"] = options.filterKeyValue
      }
    }

    return await this.client.send(new QueryCommand(queryOptions)).catch((error: Error) => error)
  }

  async getMany(tableName: string, options: GetManyOptions): PromiseResult<QueryCommandOutput> {
    const { projection, sortKey } = options
    const { lastItemKey, limit } = options.pagination

    const { attributeNames, expression } = projection ?? {}

    const queryOptions: QueryCommandInput = {
      ExpressionAttributeNames: {
        "#dummyKey": "_",
        ...attributeNames
      },
      ExpressionAttributeValues: {
        ":dummyValue": "_"
      },
      IndexName: `${sortKey}Index`,
      KeyConditionExpression: "#dummyKey = :dummyValue",
      Limit: limit,
      ProjectionExpression: expression,
      ScanIndexForward: false, // Descending order
      TableName: tableName
    }

    if (lastItemKey) {
      queryOptions.ExclusiveStartKey = { ...lastItemKey, _: "_" }
    }

    return await this.client.send(new QueryCommand(queryOptions)).catch((error: Error) => error)
  }

  async getOne(
    tableName: string,
    keyName: string,
    keyValue: unknown,
    projection?: Projection,
    stronglyConsistentRead = false
  ): PromiseResult<GetCommandOutput> {
    const { attributeNames, expression } = projection ?? {}

    return this.client
      .send(
        new GetCommand({
          ConsistentRead: stronglyConsistentRead,
          ExpressionAttributeNames: attributeNames,
          Key: {
            [keyName]: keyValue
          },
          ProjectionExpression: expression,
          TableName: tableName
        })
      )
      .catch((error: Error) => error)
  }

  async getRecordVersion(
    tableName: string,
    keyName: string,
    keyValue: unknown
  ): PromiseResult<Error | GetCommandOutput | null> {
    return await this.client
      .send(
        new GetCommand({
          ConsistentRead: true,
          Key: {
            [keyName]: keyValue
          },
          ProjectionExpression: "version",
          TableName: tableName
        })
      )
      .catch((error: Error) => error)
  }

  async insertMany<T>(tableName: string, records: T[], keyName: string): PromiseResult<void> {
    const params: TransactWriteCommandInput = {
      TransactItems: records.map((record) => ({
        Put: {
          ConditionExpression: `attribute_not_exists(${keyName})`,
          Item: { _: "_", ...record },
          TableName: tableName
        }
      }))
    }

    const result = await this.client.send(new TransactWriteCommand(params)).catch((error: Error) => error)
    if (!isError(result)) {
      return undefined
    }

    let failureReasons

    if (
      result.name === "TransactionCanceledException" &&
      result instanceof TransactionCanceledException &&
      Array.isArray(result.CancellationReasons)
    ) {
      failureReasons = result.CancellationReasons as TransactionFailureReason[]
    }

    if (failureReasons && failureReasons.length > 0) {
      return new TransactionFailedError(failureReasons, result.message)
    }

    return result
  }

  async insertOne<T extends Record<string, unknown>>(
    tableName: string,
    record: T,
    keyName: string
  ): PromiseResult<void> {
    const params: PutCommandInput = {
      ConditionExpression: "attribute_not_exists(#keyName)",
      ExpressionAttributeNames: { "#keyName": keyName },
      Item: { _: "_", ...record },
      TableName: tableName
    }

    const result = await this.client.send(new PutCommand(params)).catch((error: Error) => error)

    return isError(result) ? result : undefined
  }

  replaceMany<T>(tableName: string, records: T[], keyName: string): PromiseResult<void> {
    const dynamoQueries: TransactWriteCommandInput["TransactItems"] = records.map((record) => ({
      Put: {
        ConditionExpression: "attribute_exists(#keyName)",
        ExpressionAttributeNames: {
          "#keyName": keyName
        },
        Item: { _: "_", ...record },
        TableName: tableName
      }
    }))

    return this.executeTransaction(dynamoQueries)
  }

  async replaceOne<T extends Record<string, unknown>>(
    tableName: string,
    record: T,
    version: number
  ): PromiseResult<void> {
    const params: PutCommandInput = {
      ConditionExpression: "#version = :expectedVersion",
      ExpressionAttributeNames: {
        "#version": "version"
      },
      ExpressionAttributeValues: {
        ":expectedVersion": version
      },
      Item: record,
      TableName: tableName
    }
    const result = await this.client.send(new PutCommand(params)).catch((error: Error) => error)

    return isError(result) ? result : undefined
  }

  async updateEntry(tableName: string, options: UpdateOptions): PromiseResult<UpdateCommandOutput> {
    const { expressionAttributeNames, keyName, keyValue } = options
    const expressionAttributeValues = {
      ...options.updateExpressionValues,
      ":version": options.currentVersion,
      ":version_increment": 1
    }
    const updateExpression = `${options.updateExpression} ADD version :version_increment`

    const updateParams = <UpdateCommandInput>{
      ConditionExpression: `attribute_exists(${keyName}) and version = :version`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      Key: {
        [keyName]: keyValue
      },
      TableName: tableName,
      UpdateExpression: updateExpression
    }

    return this.client.send(new UpdateCommand(updateParams)).catch((error: Error) => error)
  }
}
