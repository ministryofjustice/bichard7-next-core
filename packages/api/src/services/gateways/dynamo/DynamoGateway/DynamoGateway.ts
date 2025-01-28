import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"
import { DynamoDB } from "aws-sdk"
import { DocumentClient } from "aws-sdk/clients/dynamodb"

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
  protected readonly client: DocumentClient

  protected readonly service: DynamoDB

  constructor(config: DynamoDbConfig) {
    this.service = new DynamoDB(config)

    this.client = new DocumentClient({
      service: this.service
    })
  }

  async deleteMany(tableName: string, keyName: string, keyValues: string[]): PromiseResult<void> {
    for (const keyValue of keyValues) {
      const result = await this.client
        .delete({
          Key: {
            [keyName]: keyValue
          },
          TableName: tableName
        })
        .promise()
        .catch((error) => <Error>error)

      if (isError(result)) {
        return result
      }
    }
  }

  executeTransaction(actions: DynamoUpdate[]): PromiseResult<void> {
    let failureReasons: TransactionFailureReason[] = []
    return this.client
      .transactWrite({ TransactItems: actions })
      .on("extractError", (response) => {
        // Error when we perform more actions than dynamodb supports
        // see https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html
        if (response.error && response.error.message?.startsWith("Member must have length less than or equal to")) {
          failureReasons.push({
            Code: "TooManyItems",
            Message: response.error.message
          })
        } else {
          // Save the returned reasons for the transaction failing as they are not returned
          try {
            failureReasons = JSON.parse(response.httpResponse.body.toString())
              .CancellationReasons as TransactionFailureReason[]
          } catch (error) {
            console.error("Error extracting cancellation error", error)
          }

          if (failureReasons === undefined || failureReasons.length < 1) {
            failureReasons = [
              {
                Code: "UnknownError",
                Message: response.httpResponse.body.toString()
              }
            ]
          }
        }
      })
      .promise()
      .then(() => {
        if (failureReasons.length > 0) {
          return new TransactionFailedError(failureReasons, failureReasons[0].Message)
        }

        return undefined
      })
      .catch((error) => {
        if (failureReasons.length > 0) {
          return new TransactionFailedError(failureReasons, error.message)
        }

        return <Error>error
      })
  }

  fetchByIndex(tableName: string, options: FetchByIndexOptions): PromiseResult<DocumentClient.QueryOutput> {
    const {
      hashKeyName: attributeName,
      hashKeyValue: attributeValue,
      indexName,
      isAscendingOrder,
      projection
    } = options
    const { lastItemKey, limit } = options.pagination

    const { attributeNames, expression } = projection ?? {}

    const queryOptions: DynamoDB.DocumentClient.QueryInput = {
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

    return this.client
      .query(queryOptions)
      .promise()
      .catch((error) => <Error>error)
  }

  getMany(tableName: string, options: GetManyOptions): PromiseResult<DocumentClient.QueryOutput> {
    const { projection, sortKey } = options
    const { lastItemKey, limit } = options.pagination

    const { attributeNames, expression } = projection ?? {}

    const queryOptions: DynamoDB.DocumentClient.QueryInput = {
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

    return this.client
      .query(queryOptions)
      .promise()
      .catch((error) => <Error>error)
  }

  getOne(
    tableName: string,
    keyName: string,
    keyValue: unknown,
    projection?: Projection,
    stronglyConsistentRead = false
  ): PromiseResult<DocumentClient.GetItemOutput | Error> {
    const { attributeNames, expression } = projection ?? {}

    return this.client
      .get({
        ConsistentRead: stronglyConsistentRead,
        ExpressionAttributeNames: attributeNames,
        Key: {
          [keyName]: keyValue
        },
        ProjectionExpression: expression,
        TableName: tableName
      })
      .promise()
      .catch((error) => <Error>error)
  }

  getRecordVersion(
    tableName: string,
    keyName: string,
    keyValue: unknown
  ): PromiseResult<DocumentClient.GetItemOutput | Error | null> {
    return this.client
      .get({
        ConsistentRead: true,
        Key: {
          [keyName]: keyValue
        },
        ProjectionExpression: "version",
        TableName: tableName
      })
      .promise()
      .catch((error) => <Error>error)
  }

  insertMany<T>(tableName: string, records: T[], keyName: string): PromiseResult<void> {
    const params: DocumentClient.TransactWriteItemsInput = {
      TransactItems: records.map((record) => {
        return {
          Put: {
            ConditionExpression: `attribute_not_exists(${keyName})`,
            Item: { _: "_", ...record },
            TableName: tableName
          }
        }
      })
    }

    let failureReasons: TransactionFailureReason[]
    return this.client
      .transactWrite(params)
      .on("extractError", (response) => {
        try {
          failureReasons = JSON.parse(response.httpResponse.body.toString())
            .CancellationReasons as TransactionFailureReason[]
        } catch (error) {
          console.error("Error extracting cancellation error", error)
        }
      })
      .promise()
      .then(() => {
        return undefined
      })
      .catch((error) => {
        if (failureReasons) {
          return new TransactionFailedError(failureReasons, error.message)
        }

        return <Error>error
      })
  }

  insertOne<T>(tableName: string, record: T, keyName: string): PromiseResult<void> {
    const params: DocumentClient.PutItemInput = {
      ConditionExpression: "attribute_not_exists(#keyName)",
      ExpressionAttributeNames: { "#keyName": keyName },
      Item: { _: "_", ...record },
      TableName: tableName
    }

    return this.client
      .put(params)
      .promise()
      .then(() => undefined)
      .catch((error) => <Error>error)
  }

  replaceMany<T>(tableName: string, records: T[], keyName: string): PromiseResult<void> {
    const dynamoQueries = []

    for (const record of records) {
      dynamoQueries.push({
        Put: {
          ConditionExpression: "attribute_exists(#keyName)",
          ExpressionAttributeNames: {
            "#keyName": keyName
          },
          Item: { _: "_", ...record },
          TableName: tableName
        }
      })
    }

    return this.executeTransaction(dynamoQueries)
  }

  replaceOne<T>(tableName: string, record: T, keyName: string, version: number): PromiseResult<void> {
    const params: DocumentClient.PutItemInput = {
      ConditionExpression: `attribute_exists(${keyName}) and version = :version`,
      ExpressionAttributeValues: {
        ":version": version
      },
      Item: { _: "_", ...record },
      TableName: tableName
    }

    return this.client
      .put(params)
      .promise()
      .then(() => undefined)
      .catch((error) => <Error>error)
  }

  updateEntry(tableName: string, options: UpdateOptions): PromiseResult<DocumentClient.UpdateItemOutput> {
    const { expressionAttributeNames, keyName, keyValue } = options
    const expressionAttributeValues = {
      ...options.updateExpressionValues,
      ":version": options.currentVersion,
      ":version_increment": 1
    }
    const updateExpression = `${options.updateExpression} ADD version :version_increment`

    const updateParams = <DocumentClient.UpdateItemInput>{
      ConditionExpression: `attribute_exists(${keyName}) and version = :version`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      Key: {
        [keyName]: keyValue
      },
      TableName: tableName,
      UpdateExpression: updateExpression
    }

    return this.client
      .update(updateParams)
      .promise()
      .catch((error) => <Error>error)
  }
}
