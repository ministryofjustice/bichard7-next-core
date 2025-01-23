import type { CreateTableOutput, DocumentClient } from "aws-sdk/clients/dynamodb"

import type { SecondaryIndex } from "./SecondaryIndex"

import AuditLogDynamoGateway from "../../../services/gateways/dynamo/AuditLogDynamoGateway/AuditLogDynamoGateway"
import getTableAttributes from "./getTableAttributes"
import getTableIndexes from "./getTableIndexes"
import Poller from "./Poller"
import PollOptions from "./PollOptions"

interface CreateTableOptions {
  keyName: string
  secondaryIndexes: SecondaryIndex[]
  skipIfExists: boolean
  sortKey?: string
}

type KeyValue = boolean | number | string

export default class TestDynamoGateway extends AuditLogDynamoGateway {
  async clearDynamo(): Promise<void> {
    await this.deleteAll(this.config.auditLogTableName, this.auditLogTableKey)
    await this.deleteAll(this.config.eventsTableName, this.eventsTableKey)
  }

  async createTable(tableName: string, options: CreateTableOptions): Promise<CreateTableOutput | undefined> {
    const { keyName, secondaryIndexes, skipIfExists, sortKey } = options

    if (skipIfExists && (await this.tableExists(tableName))) {
      return undefined
    }

    const attributes = getTableAttributes(keyName, sortKey, secondaryIndexes)
    const indexes = sortKey ? getTableIndexes(sortKey, secondaryIndexes) : undefined

    return this.service
      .createTable({
        AttributeDefinitions: attributes,
        GlobalSecondaryIndexes: indexes,
        KeySchema: [
          {
            AttributeName: keyName,
            KeyType: "HASH"
          }
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1
        },
        TableName: tableName
      })
      .promise()
  }

  async deleteAll(tableName: string, keyName: string, attempts = 5): Promise<void> {
    const items = await this.getAll(tableName)

    const promises =
      items.Items?.map((item) =>
        this.client
          .delete({
            Key: {
              [keyName]: item[keyName]
            },
            TableName: tableName
          })
          .promise()
      ) ?? []

    await Promise.all(promises)

    const remainingItems = await this.getAll(tableName)
    if (remainingItems.Count && remainingItems.Count > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      if (attempts > 0) {
        await this.deleteAll(tableName, keyName, attempts - 1)
      } else {
        throw new Error("Could not delete items from Dynamo table")
      }
    }
  }

  getAll(tableName: string): Promise<DocumentClient.ScanOutput> {
    return this.client
      .scan({
        TableName: tableName
      })
      .promise()
  }

  async getManyById<T>(tableName: string, indexName: string, keyName: string, keyValue: KeyValue): Promise<null | T[]> {
    const result = await this.client
      .query({
        ExpressionAttributeNames: {
          "#keyName": keyName
        },
        ExpressionAttributeValues: {
          ":keyValue": keyValue
        },
        IndexName: indexName,
        KeyConditionExpression: "#keyName = :keyValue",
        TableName: tableName
      })
      .promise()

    if (!result.Items || result.Items.length < 1) {
      return null
    }

    return <T[]>result.Items
  }

  pollForMessages(tableName: string, timeout: number): Promise<DocumentClient.ScanOutput | undefined> {
    const poller = new Poller(async () => {
      const response = await this.getAll(tableName)

      if (!response || response.Count === 0) {
        return undefined
      }

      return response
    })

    return poller.poll(new PollOptions(timeout))
  }

  async tableExists(tableName: string): Promise<boolean> {
    const tableResult = await this.service.listTables().promise()
    return !!tableResult.TableNames?.find((name) => name === tableName)
  }
}
